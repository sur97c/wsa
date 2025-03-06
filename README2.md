SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Report].[PlanSummaryBenefitGroup]
       @EmployerID VARCHAR (200) = N''
       , @PlanYear VARCHAR (4) = N'All'
       , @PlanType VARCHAR (6) = N'All' 
       , @ReimbursementPlan VARCHAR (200) = N'All'
       , @Department VARCHAR (MAX) = N'All'
       , @Member VARCHAR (200) = N'All'
       , @IsMaskSSN BIT = 0
       , @StartDate DATETIME = N''
       , @EndDate DATETIME = N''
       , @UserName VARCHAR (50) = N''
       , @IsInternalTeamMember INT = 0
       , @SSNMaskingFeatureNotEnabled BIT = 0
       , @BenefitGroupId VARCHAR (MAX) = N'All'
AS
BEGIN
       SET NOCOUNT ON;

       -- Remove Temporal Tables if Exists

       DROP TABLE IF EXISTS #RAs;
       DROP TABLE IF EXISTS #Final;

       -- Validate @IsInternalTeamMember 

       DECLARE @LoginRoles AS VARCHAR (300) = (
              SELECT Authentication_Roles
              FROM   #{HealthEquityDbName}.dbo.Login
              WHERE  LoginId = @UserName
       );

       DECLARE @AgentSpanRoles AS VARCHAR (300) = (
              SELECT S.RolesAndEmail
              FROM   #{HealthEquityDbName}.dbo.AgentSpan AS S
              INNER JOIN #{HealthEquityDbName}.dbo.Login AS L
                     ON L.Reference = S.Agent
                     AND L.Reference_Type = 'Agent'
              WHERE  L.LoginId = @UserName
                     AND S.Entity_Type = 'Employer'
                     AND S.Entity = @EmployerID
       );

       DECLARE @HasViewSSNRole AS BIT = (
              SELECT CAST (
                     CASE 
                            WHEN @LoginRoles LIKE '%CanViewUnmaskedIdentifiers%' 
                            THEN 1
                            WHEN @AgentSpanRoles LIKE '%CanViewUnmaskedIdentifiers%' 
                            THEN 1 
                            ELSE 0 
                     END AS BIT
              )
       );

       DECLARE @UnmaskIdentifiers AS BIT = IIF (@IsMaskSSN = 1 AND @HasViewSSNRole = 1, 1, 0);

       --Background: It has identified datetime data handled with datetime max value in several database tables (e.g Employer.BenefitGroupMember), 
       --so the updates on datetimes variables is to prevent datetime overflowing issues.
       SET @EndDate = IIF (CONVERT(DATE, @EndDate) >= CONVERT(DATE, GETDATE()), CAST ('9999-12-31 23:59:59.99' AS DATETIME), CAST(CONVERT(VARCHAR(10), @EndDate, 110) + ' 23:59:59.99' AS DATETIME));
       --Created to prevent datetime issues with datetime max value allocation (overflow) when operating with date and datetime values
       DECLARE @EndDatePlusOneDay AS DATETIME = IIF(CAST('9999-12-31' AS DATE) = CAST(@EndDate AS DATE), @EndDate, DATEADD(DAY, 1, @EndDate));

       DECLARE @IsLoginMasterUser AS BIT = (SELECT 0);

       IF @IsInternalTeamMember = 0
       BEGIN
              SELECT @IsLoginMasterUser = 1
              FROM   #{HealthEquityDbName}.Employer.BenefitGroupLoginMasterUser
              WHERE  IsMasterUser = 1
                     AND EmployerId = @EmployerId
                     AND LoginId = @UserName;
       END
	   
       IF @IsLoginMasterUser = 0
       BEGIN
              SELECT @IsLoginMasterUser = 1
              FROM #{HealthEquityDbName}.dbo.Login L
              WHERE L.LoginID=@UserName
                     AND L.Reference_Type IN ('Partner','Agent')
       END

       -- Populate #RAs
       SELECT RA.Member AS MemberID,
              RP.Employer AS EmployerID,
              CONCAT(
                     (
                            CASE 
                                   WHEN (RP.PlanTypeDescription IS NOT NULL AND RP.PlanTypeDescription!='') THEN TRIM(RP.PlanTypeDescription)
                                   WHEN (RP.PlanType='VEBA' AND P.Feature_VEBAVariableName IS NOT NULL) THEN TRIM(P.Feature_VEBAVariableName)
                                   WHEN RP.PlanType='HRA' THEN 'HRA'
                                   WHEN RP.PlanType='HCRA' THEN 'Medical FSA'
                                   WHEN RP.PlanType='LPHCRA' THEN 'Limited Purpose Medical FSA'
                                   WHEN RP.PlanType='DCRA' THEN 'Dependent Care FSA'
                                   WHEN RP.PlanType='CREA' THEN 'Commuter Reimbursement Expense Account'
                                   WHEN RP.PlanType='VEBA' THEN 'VEBA Retirement Account'
                                   ELSE ''		                
                            END
                     ), ' ', FORMAT(RA.StartDate, 'M/d/yyyy'), ' to ', FORMAT(DATEADD(DAY, -1, RA.EndDate), 'M/d/yyyy')
              ) AS AccountType,
              RA.BalanceInfo_BeginningCarryOver AS TotalRolloverDeposit,
              RA.ElectionAmount AS TotalElection,
              RA.BalanceInfo_DepositWithheld AS TotalDeposit,
              RA.BalanceInfo_YTDClaims AS TotalClaims,
              RA.BalanceInfo_ClaimsAllowed AS TotalAllowed,
              RA.BalanceInfo_ClaimsDenied AS TotalDenied,
              RA.BalanceInfo_TotalPaid AS TotalPaid,
              RA.BalanceInfo_TotalFees AS TotalFees,
              RA.BalanceInfo_TotalOther AS TotalFees2,
              RA.BalanceInfo_Overpaid - RA.BalanceInfo_Recouped AS OutstandingOverpaidAmount,
              RA.BalanceInfo_BeginningCarryOver + RA.ElectionAmount - RA.BalanceInfo_ClaimsAllowed AS PlanBalance,
              IIF (
                     RA.AccountType = 'DCRA', 
                     RA.BalanceInfo_DepositWithheld - RA.BalanceInfo_ClaimsPaid, 
                     RA.BalanceInfo_BeginningCarryOver + RA.ElectionAmount - RA.BalanceInfo_ClaimsAllowed
              ) AS YTDBalance,
              RA.BalanceInfo_CarryOverBalance AS RolloverToNewPlan,
              FORMAT(RA.StartDate, 'M/d/yyyy') AS CoverageStart,
			  CASE 
                     WHEN (RA.StartDate IS NOT NULL AND RA.EndDate IS NOT NULL AND RA.EndDate > RA.StartDate) 
                     THEN FORMAT(DATEADD(day, -1, RA.EndDate), 'M/d/yyyy') 
                     ELSE FORMAT(RA.EndDate, 'M/d/yyyy') 
              END AS CoverageEnd,
              RA.LinkedAccount,
              RA.ReimbursementAccountId,
              RP.Employer,
              RA.StartDate,
              RA.EndDate,
              RP.FundingSubaccount,
              RP.PlanYearEndDate,
              RP.PlanTyingRolloversHRA,
              RP.PlanTyingDepositsALL,
              RA.AccountType AS RAAccountType,
              CASE 
                     WHEN (RP.Feature_PayFromDepositsOnly = 1 OR RA.AccountType='HIA') 
                     THEN 1 
                     ELSE 0 
              END AS IsBalanceDepositBased,
              CASE 
                     WHEN (RP.Feature_AllowSpendDownOnTerm = 1 
                            AND (RA.EndDate<RP.PlanYearEndDate)
                            AND (
                                   CASE 
                                          WHEN (
                                                 SELECT count(ReimbursementAccountId) 
                                                 FROM #{HealthEquityDbName}.dbo.ReimbursementAccount 
                                                 WHERE LinkedAccount = RA.ReimbursementAccountId AND EndDate<= RP.PlanYearEndDate
                                          ) <= 0 
                                          THEN (
                                                 CASE 
                                                        WHEN RP.RunOutDateEarlyTerm IS NULL 
                                                        THEN DATEADD(day,RP.RunOutEarlyTermDays,RA.enddate) 
                                                        ELSE RP.RunOutDateEarlyTerm 
                                                 END
                                          ) 
                                          ELSE (
                                                 SELECT TOP 1 
                                                        CASE 
                                                               WHEN RPlra.RunOutDateEarlyTerm IS NULL 
                                                               THEN DATEADD(day,RPlra.RunOutEarlyTermDays,lra.enddate) 
                                                               ELSE RPlra.RunOutDateEarlyTerm 
                                                        END 
                                                 FROM #{HealthEquityDbName}.dbo.ReimbursementAccount lra
                                                 INNER JOIN #{HealthEquityDbName}.dbo.ReimbursementPlan AS RPlra 
                                                        ON lra.ReimbursementPlan = RPlra.ReimbursementPlanId
                                                 WHERE lra.LinkedAccount =RA.ReimbursementAccountId 
                                                 ORDER BY lra.enddate DESC
                                          )  
                                   END < getdate()
                                   AND RP.Feature_SpendDownEndDate >= getdate() 
                            ) 
                     ) 
              THEN 1 
              ELSE 0 
              END AS IsInSpendDown,
              CASE 
                     WHEN (
                            RP.Feature_HasDebitCard=1 AND RP.Feature_ExportTo='HealthEquity' 
                            AND RP.TSys_CardSetupDate != (SELECT cast(-53690 AS datetime))  
                            AND  RP.TSys_Purse IS NOT NULL 
                            AND (
                                   SELECT TSysSetupDate FROM #{HealthEquityDbName}.dbo.Purse WHERE PurseId=RP.TSys_Purse
                            ) != (SELECT cast(-53690 AS datetime)) 
                     ) 
                     THEN 1 
                     ELSE 0 
              END AS HasDebitCardAndIsSetup
              INTO   #RAs
              FROM   #{HealthEquityDbName}.dbo.ReimbursementAccount AS RA
              INNER JOIN #{HealthEquityDbName}.dbo.ReimbursementPlan AS RP
                     ON RA.ReimbursementPlan = RP.ReimbursementPlanId
                            AND RP.DateDeleted IS NULL
                            AND RP.Employer = @EmployerID
                            AND (
                                   CASE
                                          WHEN @PlanYear = 'All' THEN 1
                                          WHEN @PlanYear != 'All' AND YEAR(DATEADD(YEAR, -1, RP.PlanYearEndDate)) = @PlanYear THEN 1
                                   ELSE 0
                                   END = 1
                            )
                     AND (@PlanType = 'All'
                     OR @PlanType = RP.PlanType)
                     LEFT JOIN #{HealthEquityDbName}.dbo.Product P on P.ProductId=RP.Product
              WHERE  RA.DateDeleted IS NULL
                     AND RA.StartDate < RA.EndDate
                     AND (@ReimbursementPlan = 'All' OR RA.ReimbursementPlan = @ReimbursementPlan)                    
                     AND (@Member = 'All' OR RA.Member = @Member);

       -- Created Linked, Define BGEmployer
       WITH   Linked
       AS (
              SELECT RA.ReimbursementAccountId,
                     RA.BalanceInfo_ClaimsAllowed AS TotalAllowed,
                     RA.BalanceInfo_TotalFees AS TotalFees
              FROM   #{HealthEquityDbName}.dbo.ReimbursementAccount AS RA
              WHERE  EXISTS (
                     SELECT R.ReimbursementAccountId
                     FROM #RAs AS R
                     WHERE  R.LinkedAccount = RA.ReimbursementAccountId)
                            AND RA.StartDate <= RA.EndDate
                            AND RA.DateDeleted IS NULL
       ),
       BGEmployer AS (
              SELECT MemberId,
                     BGM.BenefitGroupId,
                     BG.Code AS BenefitGroupCode,
                     BG.Name AS BenefitGroupName,
                     BGM.BenefitGroupMemberId,
                     BGM.StartDate,
                     BGM.EndDate,
                     CASE WHEN (BGL.BenefitGroupLoginId IS NULL AND @IsInternalTeamMember = 0 AND @IsLoginMasterUser = 0) 
                            THEN 1 
                            ELSE 0 
                     END AS IsReassigned,
                     ROW_NUMBER() OVER (PARTITION BY BGM.MemberId ORDER BY BGM.EndDate DESC) AS RowNumber
              FROM   #{HealthEquityDbName}.Employer.BenefitGroupMember AS BGM
              INNER JOIN #{HealthEquityDbName}.Employer.BenefitGroup AS BG
                     ON BG.BenefitGroupId = BGM.BenefitGroupId
              LEFT OUTER JOIN #{HealthEquityDbName}.Employer.BenefitGroupLogin AS BGL
                     ON BGM.BenefitGroupId = BGL.BenefitGroupId
                     AND BGL.LoginId = @UserName
                     AND BGL.IsActive = 1
              WHERE  BG.EmployerID = @EmployerID
                     AND BGM.StartDate >= @StartDate
                     -- AND BGM.EndDate <= @EndDate				  
       )

       -- Populate #Final
       SELECT RA.MemberID,
              RA.ReimbursementAccountId,
              RA.RAAccountType,
              RA.FundingSubaccount,
              RA.PlanTyingRolloversHRA,
              RA.PlanTyingDepositsALL,
              RA.Employer,
              RA.StartDate,
              RA.EndDate,
              RA.PlanYearEndDate,
              RA.IsBalanceDepositBased,
              RA.IsInSpendDown,
              RA.HasDebitCardAndIsSetup,
              CI.EmployeeId,
              M.SSN,
              CI.Department,
              TRIM(
                     CONCAT(
                            M.Name_LastName,
                            IIF(M.Name_LastName = '' OR M.Name_LastName IS NULL, '',  ', '),
                            M.Name_FirstName, 
                            IIF(M.Name_FirstName = '' OR M.Name_FirstName IS NULL, '', ' '),
                            IIF(M.Name_MiddleName = '' OR M.Name_MiddleName IS NULL, '', CONCAT(LEFT(M.Name_MiddleName, 1), '. ')),
                            IIF(M.Name_Suffix = '' OR M.Name_Suffix IS NULL, '', M.Name_Suffix)
                     )
              ) AS MemberName,
              RA.AccountType,
              CASE WHEN (L.ReimbursementAccountId IS NOT NULL AND RA.PlanTyingRolloversHRA=1) THEN BIBCOLK.BeginningCarryOver ELSE BIBCO.BeginningCarryOver END AS TotalRolloverDeposit,
              RA.TotalElection AS TotalElection,
              CASE WHEN (L.ReimbursementAccountId IS NOT NULL AND RA.PlanTyingDepositsALL=1) THEN ISNULL(ISNULL(ISNULL(BGM.TotalDepositBGLK, BITDLK.TotalDeposit),RA.TotalDeposit),0)  ELSE ISNULL(ISNULL(ISNULL(BGM.TotalDepositBG, BITD.TotalDeposit),RA.TotalDeposit),0)  END AS TotalDeposit,
              BIYTD.YearTotalDeposit,
              ISNULL(BGM.TotalClaimsBG, BITC.TotalClaims) AS TotalClaims,
              ISNULL(BGM.TotalAllowedBG, BITC.TotalAllowed) AS TotalAllowed,
              CASE WHEN (L.ReimbursementAccountId IS NOT NULL) THEN BITRLK.totalReimbursed - ISNULL(BGM.TotalAllowedBG, BITC.TotalAllowed) ELSE 0 END AS TotalAllowedFromOtherRA,
              ISNULL(BGM.TotalDeniedBG, ISNULL(BITC.TotalDenied, 0)) AS TotalDenied,
              (ISNULL(BGM.ClaimPaidBG, BICP.ClaimPaid) + ISNULL(BGM.ClaimsWaitingPaymentBG, BICWP.ClaimsWaitingPayment)) AS TotalPaid,
              ISNULL(LT.TotalFees, 0) AS TotalFeesFromOtherRA,
              BIBCO.BeginningCarryOver,
              ISNULL(BGM.totalFeesBG, BITF.totalFees) AS totalFees,
		CASE WHEN (L.ReimbursementAccountId IS NOT NULL) THEN BICAODLK.claimsAllowedAsOfDate ELSE BICAOD.claimsAllowedAsOfDate  END as claimsAllowedAsOfDate,			
		CASE WHEN (L.ReimbursementAccountId IS NOT NULL) THEN ISNULL(BGM.totalFeesBG, BITFRALK.totalFees)  ELSE ISNULL(BGM.totalFeesBG, BITFRA.totalFees) END as totalFeesRA,
		CASE WHEN (L.ReimbursementAccountId IS NOT NULL) THEN BITRLK.totalReimbursed ELSE BITR.totalReimbursed  END as totalReimbursed,
              --IIF (((ISNULL(BIEA.TotalElection,RA.TotalElection) + ISNULL(BIBCO.BeginningCarryOver,RA.TotalRolloverDeposit)) - (BICAOD.claimsAllowedAsOfDate + BITF.totalFees)) 
              --<((ISNULL(BIEA.TotalElection,RA.TotalElection) + ISNULL(BIBCO.BeginningCarryOver,RA.TotalRolloverDeposit)) - (BITR.totalReimbursed + BITF.totalFees))
              --,((ISNULL(BIEA.TotalElection,RA.TotalElection) + ISNULL(BIBCO.BeginningCarryOver,RA.TotalRolloverDeposit)) - (BICAOD.claimsAllowedAsOfDate + BITF.totalFees)),
              --((ISNULL(BIEA.TotalElection,RA.TotalElection) + ISNULL(BIBCO.BeginningCarryOver,RA.TotalRolloverDeposit)) - (BITR.totalReimbursed + BITF.totalFees))
              --) AS PlanBalance,

              --Sum of Total Allowed for the Plan for the member =  BITC.TotalAllowed   (Is calculated by RA)
              (CASE WHEN (L.ReimbursementAccountId IS NOT NULL AND RA.PlanTyingRolloversHRA=1) THEN BIBCOLK.BeginningCarryOver ELSE BIBCO.BeginningCarryOver END + RA.TotalElection - ISNULL(BITC.TotalAllowed, BGM.TotalAllowedBG)) AS PlanBalance,
              (CASE WHEN (L.ReimbursementAccountId IS NOT NULL AND RA.PlanTyingRolloversHRA=1) THEN BIBCOLK.BeginningCarryOver ELSE BIBCO.BeginningCarryOver END + RA.TotalElection - ISNULL(BITC.TotalAllowed, BGM.TotalAllowedBG)) AS YTDBalance,
              RA.CoverageStart,
              RA.CoverageEnd,
              CI.CoverageIntentId,
              BGM.BenefitGroupCode,
              BGM.BenefitGroupName,
              BGM.StartDate AS BGStartDate,
              BGM.EndDate AS BGEndDate,
              BGM.IsReassigned,
              CASE WHEN L.ReimbursementAccountId IS NULL THEN 0 ELSE 1 END AS HasLinkedAccounts
       INTO   #Final
       FROM   #RAs AS RA
       LEFT OUTER JOIN Linked AS L
              ON RA.LinkedAccount = L.ReimbursementAccountId 
	   LEFT OUTER JOIN Linked AS LT
              ON RA.LinkedAccount = LT.ReimbursementAccountId 
			  and RA.ReimbursementAccountId != LT.ReimbursementAccountId
       OUTER APPLY (
                     SELECT TOP 1 OACI.Member,
				       OACI.Employer,
					OACI.EmployeeId,
					OACI.EmployeeCategory AS Department,
					OACI.CoverageIntentId
			FROM	#{HealthEquityDbName}.dbo.CoverageIntent AS OACI
			WHERE	OACI.Member = RA.MemberID
                            AND OACI.Employer = RA.EmployerID
                     ORDER BY DateDeleted DESC, AuditInfo_CreatedAt DESC
       ) AS CI
       INNER JOIN #{HealthEquityDbName}.dbo.Member AS M ON M.MemberId = RA.MemberID 
       OUTER APPLY (
                     SELECT ISNULL(SUM(SD.DollarAmount),0) AS TotalDeposit
                     FROM   #{HealthEquityDbName}.dbo.ScheduledItem AS SD
                     WHERE  SD.Reference = RA.ReimbursementAccountId
                                   AND SD.ObjectType = 'ScheduledDeduction'
                                   AND SD.Status = 'Completed'
                                   AND SD.Flag1 = 0 
                                   AND SD.DueDate<=@EndDate
       ) AS BITD
       OUTER APPLY (	
                     SELECT
                     ISNULL(SUM(SD.DollarAmount),0) as TotalDeposit
                     FROM
                     #{HealthEquityDbName}.dbo.ScheduledItem SD 
                     WHERE  SD.Reference IN (
                            SELECT ReimbursementAccountId 
                            FROM #{HealthEquityDbName}.dbo.ReimbursementAccount 
                            WHERE LinkedAccount=L.ReimbursementAccountId)
                                   AND SD.ObjectType='ScheduledDeduction' 
                                   AND SD.Status='Completed'
                                   AND SD.Flag1=0 --IsRolloverDeposit
                                   AND SD.DueDate<=@EndDate
       ) AS BITDLK --BalanceInfoTotalDeposit
	   OUTER APPLY (
              SELECT ISNULL(SUM(SD.DollarAmount),0) AS YearTotalDeposit							
              FROM #{HealthEquityDbName}.dbo.ScheduledItem SD 
              WHERE  SD.Reference=RA.ReimbursementAccountId
                     AND SD.ObjectType='ScheduledDeduction' 
                     AND SD.Status='Completed'
                     AND SD.DueDate<=@EndDate
       ) AS BIYTD
       OUTER APPLY (
                     SELECT
                            ISNULL(SUM(SP.Amount1),0) as TotalClaims ,
                            ISNULL(SUM(SP.DollarAmount),0) as TotalAllowed,
                            SUM(CASE WHEN SP.Amount2 IS NULL
                            OR SP.Status IN (N'Pending', N'NeedsApproval') THEN SP.Amount1 - SP.DollarAmount ELSE SP.Amount2 END) AS TotalDenied
                     FROM (
                            SELECT 
                                   SP.ScheduledItemId,SP.Amount1,SP.DollarAmount,SP.Amount2,SP.Status
                            FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] SP
                            OUTER APPLY (select  CashInOutId,Payment 
                                                        FROM #{HealthEquityDbName}.dbo.CashInOut AS OACIO
                                                        WHERE OACIO.Reference = SP.ScheduledItemId 
                                                               AND  Payment is not null 
                            ) AS OACIO							  
                            OUTER APPLY (SELECT top 1 min(P.EffectiveDate) as EffectiveDate
                                                        FROM  #{HealthEquityDbName}.dbo.Payment AS P
                                                        WHERE P.PaymentId in (OACIO.Payment)												 
                            )	AS P	
                            WHERE SP.FundingSource=RA.ReimbursementAccountId 
                                          AND SP.ObjectType='ScheduledPayment' 								 
                                          and ( SP.Status='Completed' 
                                                               OR (SP.Status='NeedsApproval'
                                                                      AND (
                                                                             SP.Amount1>0 
                                                                             and SP.Amount2>0 
                                                                             and SP.Amount3>0 
                                                                             and SP.Amount3<SP.Amount1 
                                                                             and SP.Flag7=0 
                                                                             and (SP.Amount2-SP.Amount5-SP.Amount7)!=0 
                                                                             and SP.Reference_Type='Claim'
                                                                             )
                                                        )
                                                 )
                                          AND (SP.Flag5=0 --IsRAReverse
                                                 OR SP.Flag6=0 --IsRAReissue		   		   
                                                 )	  
                                          AND (
                                                        (P.EffectiveDate IS NOT NULL AND P.EffectiveDate<=@EndDatePlusOneDay)
                                                        OR
                                                        (P.EffectiveDate IS NULL AND (SP.DueDate>=@StartDate AND SP.DueDate<=@EndDatePlusOneDay))
                                                 )	
                                   GROUP BY SP.ScheduledItemId,SP.Amount1,SP.DollarAmount,SP.Amount2,SP.Status
                            ) AS SP
       ) AS BITC       
       OUTER APPLY (             
			  SELECT (ISNULL(SUM(TL.Amount), 0) * -1) AS ClaimPaid
				FROM #{HealthEquityDbName}.dbo.ScheduledItem AS SI
					 INNER JOIN #{HealthEquityDbName}.dbo.CashInOut AS OACIO
								ON SI.ScheduledItemId = OACIO.Reference
					 INNER JOIN #{HealthEquityDbName}.dbo.Payment AS P
								ON OACIO.Payment = P.PaymentId
					 INNER JOIN #{HealthEquityDbName}.dbo.TransferLine AS TL
								ON TL.CashInOut = OACIO.CashInOutId
								AND TL.ReimbursementAccount =SI.FundingSource
								AND TL.Category <> N'Premium'
				WHERE SI.FundingSource =RA.ReimbursementAccountId
						AND SI.ObjectType = N'ScheduledPayment'
						AND ( SI.Status='Completed' 
								OR (SI.Status='NeedsApproval'
									AND (
										SI.Amount1>0 
										and SI.Amount2>0 
										and SI.Amount3>0 
										and SI.Amount3<SI.Amount1 
										and SI.Flag7=0 
										and (SI.Amount2-SI.Amount5-SI.Amount7)!=0 
										and SI.Reference_Type='Claim'
										)
							       )
							)									
						AND P.PaymentId IS NOT NULL 
						AND (SI.DueDate<=@EndDatePlusOneDay) 
						AND P.EffectiveDate<=@EndDatePlusOneDay
       ) AS BICP  
       OUTER APPLY (
              SELECT ISNULL(SUM(TL.Amount),0) * -1 AS ClaimsWaitingPayment
              FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL
              LEFT OUTER JOIN #{HealthEquityDbName}.dbo.Payment AS P
                     ON P.PaymentId = TL.Payment
              WHERE  TL.ReimbursementAccount = RA.ReimbursementAccountId
                     AND TL.Subaccount = RA.FundingSubaccount
                     AND TL.Category != 'Premium'
                     AND TL.Payment IS NULL
       ) AS BICWP
       OUTER APPLY (
              SELECT ISNULL(SUM(SD.DollarAmount), 0) AS BeginningCarryOver
              FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] AS SD
              WHERE  SD.Reference = RA.ReimbursementAccountId
                     AND SD.ObjectType = 'ScheduledDeduction'
                     AND SD.Status = 'Completed'
                     AND SD.Flag1 = 1
       ) AS BIBCO
	   OUTER APPLY (              
					  SELECT ISNULL(SUM(SD.DollarAmount),0) AS BeginningCarryOver
					  FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] AS SD 
					  WHERE  SD.Reference IN (select ReimbursementAccountId from #{HealthEquityDbName}.dbo.ReimbursementAccount where LinkedAccount=L.ReimbursementAccountId)			         				
							 AND SD.ObjectType = 'ScheduledDeduction'
							 AND SD.Status = 'Completed'
							 AND SD.Flag1 = 1					
       ) AS BIBCOLK 
       OUTER APPLY (
              SELECT SUM(SP.DollarAmount) AS claimsAllowedAsOfDate
              FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] AS SP                                                                                          
              WHERE  SP.FundingSource = RA.ReimbursementAccountId
                     AND SP.ObjectType = 'ScheduledPayment'
                     AND (
                            SP.Status = 'Completed'
                            OR (
                                   SP.Status = 'NeedsApproval'
                                   AND (
                                          SP.Amount1 > 0
                                          AND SP.Amount2 > 0
                                          AND SP.Amount3 > 0
                                          AND SP.Amount3 < SP.Amount1
                                          AND SP.Flag7 = 0
                                          AND (SP.Amount2 - SP.Amount5 - SP.Amount7) != 0
                                          AND SP.Reference_Type = 'Claim'
                                   )
                            )
                     )
                     AND (SP.Flag5 = 0 OR SP.Flag6 = 0)
                     AND (SP.Date1<@EndDatePlusOneDay OR RA.PlanYearEndDate=RA.EndDate)
       ) AS BICAOD
       OUTER APPLY(
						select 
						ISNULL(SUM(SP.DollarAmount),0) as claimsAllowedAsOfDate
						FROM 
						#{HealthEquityDbName}.dbo.[ScheduledItem] SP					           
						WHERE  SP.FundingSource IN (select ReimbursementAccountId from #{HealthEquityDbName}.dbo.ReimbursementAccount where LinkedAccount=L.ReimbursementAccountId)
							   AND SP.ObjectType='ScheduledPayment'     
							  and ( SP.Status='Completed' 
										  OR (SP.Status='NeedsApproval'
												AND (
													SP.Amount1>0 
													and SP.Amount2>0 
													and SP.Amount3>0 
													and SP.Amount3<SP.Amount1 
													and SP.Flag7=0 
													and (SP.Amount2-SP.Amount5-SP.Amount7)!=0 
													and SP.Reference_Type='Claim'
													)
									  )
								  )
							  AND (SP.Flag5=0 --IsRAReverse
								   OR SP.Flag6=0 --IsRAReissue		   		   
								  )	  							  
							  AND (SP.Date1<@EndDatePlusOneDay OR RA.PlanYearEndDate=RA.EndDate)
       ) AS BICAODLK -- BalanceInfo.claimsAllowedAsOfDate	   
       OUTER APPLY(
					SELECT ISNULL(SUM(TL.Amount), 0) * -1 AS totalFees
					FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL	
							INNER JOIN #{HealthEquityDbName}.dbo.Payment P
						    ON P.PaymentId =TL.Payment 
					WHERE  TL.ReimbursementAccount = RA.ReimbursementAccountId
							AND TL.Subaccount = RA.FundingSubaccount
							AND TL.Category = 'Premium'    
							AND TL.Payment IS NOT NULL
							AND P.EffectiveDate<=@EndDate
       ) AS BITF --BalanceInfo._totalFeesToDate
       OUTER APPLY(
					SELECT ISNULL(SUM(TL.Amount), 0) * -1 AS totalFees
					FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL	
							INNER JOIN #{HealthEquityDbName}.dbo.Payment P
						    ON P.PaymentId =TL.Payment 
					WHERE  TL.ReimbursementAccount = RA.ReimbursementAccountId
							AND TL.Subaccount = RA.FundingSubaccount
							AND TL.Category = 'Premium'    
							AND TL.Payment IS NOT NULL							         
       ) AS BITFRA --BalanceInfo._totalFees
       OUTER APPLY(
					SELECT ISNULL(SUM(TL.Amount), 0) * -1 AS totalFees
					FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL	
							INNER JOIN #{HealthEquityDbName}.dbo.Payment P
						    ON P.PaymentId =TL.Payment 
					WHERE  TL.ReimbursementAccount IN (select ReimbursementAccountId from #{HealthEquityDbName}.dbo.ReimbursementAccount where LinkedAccount=L.ReimbursementAccountId)
							AND TL.Subaccount = RA.FundingSubaccount
							AND TL.Category = 'Premium'    
							AND TL.Payment IS NOT NULL							         
       ) AS BITFRALK --BalanceInfo._totalFees Linked Accounts	   
      OUTER APPLY (            
			  SELECT ISNULL(SUM(SP.DollarAmount),0) AS totalReimbursed
              FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] AS SP
			  LEFT JOIN #{HealthEquityDbName}.dbo.CashInOut AS OACIO
						ON SP.ScheduledItemId = OACIO.Reference
						and Payment is not null 
			  LEFT JOIN #{HealthEquityDbName}.dbo.Payment AS P
						ON OACIO.Payment = P.PaymentId
              WHERE  SP.FundingSource = RA.ReimbursementAccountId
                     AND SP.ObjectType = 'ScheduledPayment'
                     AND 
					 (SP.Status = 'Completed'
					  OR ( SP.Status = 'NeedsApproval'
							AND (
								SP.Amount1 > 0
								AND SP.Amount2 > 0
								AND SP.Amount3 > 0
								AND SP.Amount3 < SP.Amount1
								AND SP.Flag7 = 0
								AND (SP.Amount2 - SP.Amount5 - SP.Amount7) != 0
								AND SP.Reference_Type = 'Claim'
								)
						)
					)
					AND (SP.Flag5 = 0 OR SP.Flag6 = 0)
					AND (
							(P.EffectiveDate IS NOT NULL AND P.EffectiveDate<=@EndDate)
							OR
							(P.EffectiveDate IS NULL AND SP.DueDate<=@EndDate)
						)

       ) AS BITR 
	   OUTER APPLY (             
			  SELECT ISNULL(SUM(SP.DollarAmount),0) AS totalReimbursed
              FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] AS SP
			  LEFT JOIN #{HealthEquityDbName}.dbo.CashInOut AS OACIO
						ON SP.ScheduledItemId = OACIO.Reference
						and Payment is not null 
			  LEFT JOIN #{HealthEquityDbName}.dbo.Payment AS P
						ON OACIO.Payment = P.PaymentId
              WHERE  SP.FundingSource IN (select ReimbursementAccountId from #{HealthEquityDbName}.dbo.ReimbursementAccount where LinkedAccount=L.ReimbursementAccountId)
                     AND SP.ObjectType = 'ScheduledPayment'
                     AND 
					 (SP.Status = 'Completed'
					  OR ( SP.Status = 'NeedsApproval'
							AND (
								SP.Amount1 > 0
								AND SP.Amount2 > 0
								AND SP.Amount3 > 0
								AND SP.Amount3 < SP.Amount1
								AND SP.Flag7 = 0
								AND (SP.Amount2 - SP.Amount5 - SP.Amount7) != 0
								AND SP.Reference_Type = 'Claim'
								)
						)
					)
					 AND (SP.Flag5 = 0 OR SP.Flag6 = 0)
					 AND (
							(P.EffectiveDate IS NOT NULL AND P.EffectiveDate<=@EndDate)
							OR
							(P.EffectiveDate IS NULL AND SP.DueDate<=@EndDate)
						)
       ) AS BITRLK        
       OUTER APPLY (
              SELECT BGFinalResult.MemberId,
                     BGFinalResult.BenefitGroupId,
                     BGFinalResult.BenefitGroupCode,
                     BGFinalResult.BenefitGroupName,
                     BGFinalResult.StartDate,
                     BGFinalResult.EndDate,
                     BGFinalResult.BenefitGroupMemberId,
                     BGFinalResult.IsReassigned,
                     BITD.TotalDepositBG,
                     BITDLK.TotalDepositBGLK,
                     BITC.TotalClaimsBG,
                     BITC.TotalAllowedBG,
                     BITDenied.TotalDeniedBG,
                     BICP.ClaimPaidBG,
                     BICWP.ClaimsWaitingPaymentBG,
                     BITF.totalFeesBG
              FROM
              (
                     SELECT BGResult.MemberId
                            ,BGResult.BenefitGroupId
                            ,BGResult.BenefitGroupCode
                            ,BGResult.BenefitGroupName
                            ,BGResult.BenefitGroupMemberId
                            ,Min(BGResult.StartDate) AS StartDate
                            ,Max(BGResult.EndDate) AS EndDate
                            ,IIF(CAST('9999-12-31' AS DATE) = CAST(MAX(BGResult.EndDate) AS DATE), MAX(BGResult.EndDate), DATEADD(DAY, 1, MAX(BGResult.EndDate))) BGResult_EndDatePlusOneDay
                            ,BGResult.IsReassigned
                     FROM 
                     (
                            SELECT BGM.MemberId
                                   ,BGM.BenefitGroupId
                                   ,BGM.BenefitGroupCode
                                   ,BGM.BenefitGroupName
                                   ,BGM.BenefitGroupMemberId
                                   ,BGM.StartDate
                                   ,BGM.EndDate
                                   ,BGM.IsReassigned
                            FROM BGEmployer AS BGM
                            INNER JOIN #{HealthEquityDbName}.dbo.Dependent AS D 
                                   ON BGM.MemberId = D.Member
                                   AND D.Relationship = 'Self'
                            LEFT JOIN #{HealthEquityDbName}.dbo.[Card] AS C 
                                   ON C.[Dependent] = D.DependentId
							OUTER APPLY (SELECT 										 										 
										 SD.ScheduledItemId,SD.DueDate,SD.Reference
										 FROM #{HealthEquityDbName}.dbo.ScheduledItem AS SD 
										 WHERE SD.FundingSource = RA.ReimbursementAccountId
										 AND SD.[Status] = N'Completed'
										 AND SD.ObjectType = N'ScheduledPayment'	
										 group by SD.ScheduledItemId,SD.DueDate,SD.Reference
							) AS SD
                            OUTER APPLY (
                                   SELECT ServiceStart
                                   FROM #{HealthEquityDbName}.dbo.Claim 
                                   WHERE ClaimId= SD.Reference         
                            ) AS CL
                            OUTER APPLY (
                                   SELECT SettlementDate
                                   FROM #{HealthEquityDbName}.dbo.CardTransaction CT
                                   WHERE CT.Card = C.CardId 
                                          AND ct.type='Authorization' 
                                          AND ct.SettlementDate IS NOT NULL
                            ) AS CT  
							OUTER APPLY (SELECT TOP 1 
										OACIO.Reference,
										OACIO.[Date],
										OACIO.Payment,
										OACIO.CashInOutId,
										OACIO.Category
										FROM #{HealthEquityDbName}.dbo.CashInOut AS OACIO
										LEFT OUTER JOIN #{HealthEquityDbName}.dbo.Payment AS P
										                ON P.PaymentId = OACIO.Payment
										WHERE OACIO.Reference = SD.ScheduledItemId
										ORDER BY P.EffectiveDate, OACIO.[Date]
							) AS CIO
							OUTER APPLY (SELECT  TOP 1 OAP.EffectiveDate,
										OAP.Method,
										OAP.Reference
										FROM #{HealthEquityDbName}.dbo.Payment AS OAP
										WHERE CIO.Payment = OAP.PaymentId
										ORDER BY OAP.EffectiveDate) AS P
                            WHERE   BGM.MemberId=RA.MemberID
							        AND CAST (COALESCE (CL.ServiceStart, CT.SettlementDate,P.EffectiveDate, CIO.[Date],SD.DueDate) AS DATE) BETWEEN BGM.StartDate AND BGM.EndDate                                   
                            GROUP BY BGM.MemberId, BGM.BenefitGroupId, BGM.BenefitGroupCode, BGM.BenefitGroupName, BGM.BenefitGroupMemberId, BGM.StartDate, BGM.EndDate, BGM.IsReassigned	
                     ) AS BGResult
                     GROUP BY BGResult.MemberId, BGResult.BenefitGroupId, BGResult.BenefitGroupCode, BGResult.BenefitGroupName, BGResult.BenefitGroupMemberId, BGResult.IsReassigned
              ) AS BGFinalResult
              OUTER APPLY (
                     SELECT ISNULL(SUM(SD.DollarAmount), 0) AS TotalDepositBG
                     FROM   #{HealthEquityDbName}.dbo.ScheduledItem AS SD
                     WHERE  SD.Reference = RA.ReimbursementAccountId
                            AND SD.ObjectType = 'ScheduledDeduction'
                            AND SD.Status = 'Completed'
                            AND SD.Flag1 = 0
                            AND (
                                   BGFinalResult.StartDate IS NOT NULL
                                   AND (
                                          SD.DueDate >= BGFinalResult.StartDate
                                          AND SD.DueDate <= BGFinalResult.EndDate
                                   )
                            )
              ) AS BITD 
			  OUTER APPLY (
                            SELECT 
                                   ISNULL(SUM(SD.DollarAmount),0) as TotalDepositBGLK							
                            FROM #{HealthEquityDbName}.dbo.ScheduledItem SD 
                            WHERE  SD.Reference IN (select ReimbursementAccountId from #{HealthEquityDbName}.dbo.ReimbursementAccount where LinkedAccount=L.ReimbursementAccountId)
                                   AND SD.ObjectType='ScheduledDeduction' 
                                   AND SD.Status='Completed'
                                   AND SD.Flag1=0 --IsRolloverDeposit	
                                   AND (
                                   BGFinalResult.StartDate IS NOT NULL
                                   AND (
                                                 SD.DueDate >= BGFinalResult.StartDate
                                                 AND SD.DueDate <= BGFinalResult.EndDate
                                   )
                     )
              ) AS BITDLK --BalanceInfoTotalDeposit
              OUTER APPLY (
                     SELECT ISNULL(SUM(SP.Amount1),0) AS TotalClaimsBG,
                            ISNULL(SUM(SP.DollarAmount),0) AS TotalAllowedBG
                     FROM (
                            SELECT SP.ScheduledItemId,SP.Amount1,SP.DollarAmount
                            FROM   #{HealthEquityDbName}.dbo.[ScheduledItem] SP 
                            LEFT OUTER JOIN #{HealthEquityDbName}.dbo.Claim AS C
                                   ON C.ClaimId= SP.Reference
                            LEFT JOIN #{HealthEquityDbName}.dbo.CashInOut CIO 
                                   ON CIO.Reference=SP.ScheduledItemId
                            LEFT JOIN #{HealthEquityDbName}.dbo.Payment P 
                                   ON P.PaymentId=CIO.Payment            								 
                            WHERE SP.FundingSource=RA.ReimbursementAccountId 
                                   AND SP.ObjectType='ScheduledPayment' 								 
                                   AND (
                                          SP.Status='Completed'
                                          OR (
                                                 SP.Status='NeedsApproval'
                                                 AND (
                                                        SP.Amount1>0 
                                                        AND SP.Amount2>0 
                                                        AND SP.Amount3>0 
                                                        AND SP.Amount3<SP.Amount1 
                                                        AND SP.Flag7=0 
                                                        AND (SP.Amount2-SP.Amount5-SP.Amount7) != 0 
                                                        AND SP.Reference_Type='Claim'
                                                 )
                                          )
                                   )
                                   AND (
                                          SP.Flag5=0
                                          OR SP.Flag6=0
                                   )
								   AND CAST (COALESCE (C.ServiceStart,P.EffectiveDate, CIO.Date,SP.DueDate) AS DATE) BETWEEN BGFinalResult.StartDate AND BGFinalResult.EndDate                                   
                            GROUP BY SP.ScheduledItemId, SP.Amount1, SP.DollarAmount
                     ) AS SP
              ) AS BITC
              OUTER APPLY (
                     SELECT SUM(
                            CASE WHEN SI.Amount2 IS NULL OR SI.Status IN (N'Pending', N'NeedsApproval') 
                            THEN SI.Amount1 - SI.DollarAmount 
                            ELSE SI.Amount2 END
                     ) AS TotalDeniedBG
					 FROM(
					       SELECT 
						    SI.ScheduledItemId,SI.Amount1,SI.DollarAmount,SI.Amount2,SI.Status
                                          FROM #{HealthEquityDbName}.dbo.ScheduledItem AS SI
                                          OUTER APPLY (SELECT CashInOutId,Payment 
                                                                      FROM #{HealthEquityDbName}.dbo.CashInOut AS OACIO
                                                                      WHERE OACIO.Reference = SI.ScheduledItemId 
                                                                             AND Payment is not null 
                                                        ) AS OACIO							  
                                          OUTER APPLY (SELECT top 1 min(P.EffectiveDate) as EffectiveDate
                                                               FROM  #{HealthEquityDbName}.dbo.Payment AS P
                                                               WHERE P.PaymentId in (OACIO.Payment)												 
                                                        ) AS P
                                          WHERE SI.FundingSource = RA.ReimbursementAccountId
                                                 AND SI.ObjectType = N'ScheduledPayment'
                                                 AND ( SI.Status='Completed' 
                                                               OR (SI.Status='NeedsApproval'
                                                                      AND (
                                                                             SI.Amount1>0 
                                                                             and SI.Amount2>0 
                                                                             and SI.Amount3>0 
                                                                             and SI.Amount3<SI.Amount1 
                                                                             and SI.Flag7=0 
                                                                             and (SI.Amount2-SI.Amount5-SI.Amount7)!=0 
                                                                             and SI.Reference_Type='Claim'
                                                                             )
                                                               )
                                                        )
                                                 AND (SI.Flag5=0 --IsRAReverse
                                                        OR SI.Flag6=0 --IsRAReissue		   		   
                                                 )
                                                 AND (
                                                        (P.EffectiveDate IS NOT NULL AND P.EffectiveDate<=BGFinalResult.BGResult_EndDatePlusOneDay)
                                                        OR
                                                        (P.EffectiveDate IS NULL AND (SI.DueDate>=BGFinalResult.StartDate AND SI.DueDate<=BGFinalResult.BGResult_EndDatePlusOneDay))
                                                 )
                                          GROUP BY SI.ScheduledItemId,SI.Amount1,SI.DollarAmount,SI.Amount2,SI.Status
                                   ) AS SI
              ) AS BITDenied 
			  OUTER APPLY(									
						SELECT (ISNULL(SUM(TL.Amount), 0) * -1) AS ClaimPaidBG
						FROM #{HealthEquityDbName}.dbo.ScheduledItem AS SI
							 INNER JOIN #{HealthEquityDbName}.dbo.CashInOut AS OACIO
										ON SI.ScheduledItemId = OACIO.Reference
							 INNER JOIN #{HealthEquityDbName}.dbo.Payment AS P
										ON OACIO.Payment = P.PaymentId
							 INNER JOIN #{HealthEquityDbName}.dbo.TransferLine AS TL
										ON TL.CashInOut = OACIO.CashInOutId
										AND TL.ReimbursementAccount =SI.FundingSource
										AND TL.Category <> N'Premium'
						WHERE SI.FundingSource =RA.ReimbursementAccountId
								AND SI.ObjectType = N'ScheduledPayment'
								and ( SI.Status='Completed' 
												  OR (SI.Status='NeedsApproval'
														AND (
															SI.Amount1>0 
															and SI.Amount2>0 
															and SI.Amount3>0 
															and SI.Amount3<SI.Amount1 
															and SI.Flag7=0 
															and (SI.Amount2-SI.Amount5-SI.Amount7)!=0 
															and SI.Reference_Type='Claim'
															)
											  )
										  )									
								AND P.PaymentId IS NOT NULL
								AND (SI.DueDate<=@EndDatePlusOneDay) 
								AND (P.EffectiveDate <= BGFinalResult.StartDate AND P.EffectiveDate<=BGFinalResult.BGResult_EndDatePlusOneDay)
			  ) AS BICP 
              OUTER APPLY (
                     SELECT ISNULL(SUM(TL.Amount), 0) AS ClaimsWaitingPaymentBG
                     FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL
                     LEFT OUTER JOIN #{HealthEquityDbName}.dbo.Payment AS P
                            ON P.PaymentId = TL.Payment
                     WHERE  TL.ReimbursementAccount = RA.ReimbursementAccountId
                            AND TL.Subaccount = RA.FundingSubaccount
                            AND TL.Category != 'Premium'
                            AND TL.Payment IS NULL
                            AND (
                                   NOT (
                                          TL.Payment IS NOT NULL
                                          AND P.PaymentId IS NOT NULL
                                          AND (
                                                 P.State = 'Pending'
                                                 OR P.State = 'Released'
                                          )
                                   )
                                   OR (
                                          P.EffectiveDate IS NOT NULL
                                          AND (
                                                 P.EffectiveDate >= BGFinalResult.StartDate
                                                 AND P.EffectiveDate <= BGFinalResult.EndDate
                                          )
                                   )
                            )
              ) AS BICWP 
			  OUTER APPLY(
					SELECT ISNULL(SUM(TL.Amount), 0) * -1 AS totalFeesBG
					FROM   #{HealthEquityDbName}.dbo.TransferLine AS TL	
							INNER JOIN #{HealthEquityDbName}.dbo.Payment P
						    ON P.PaymentId =TL.Payment 
					WHERE  TL.ReimbursementAccount = RA.ReimbursementAccountId
							AND TL.Subaccount = RA.FundingSubaccount
							AND TL.Category = 'Premium'    
							AND TL.Payment IS NOT NULL
							AND (P.EffectiveDate>=BGFinalResult.StartDate and P.EffectiveDate<=BGFinalResult.EndDate)
              ) AS BITF --BalanceInfo._totalFeesToDate       
       ) AS BGM
       WHERE (
                     @Department = 'All'
                     OR CI.Department IN (
                            SELECT VALUE FROM String_Split (@Department, ',')
                     )
              )
              AND (
                     @BenefitGroupId = 'All'
                     OR BGM.BenefitGroupName IN (
                            SELECT VALUE FROM string_split (@BenefitGroupId, ',')
                     )
              );
       -- Masking / Unmasking
       IF @SSNMaskingFeatureNotEnabled = 1
       BEGIN
              SELECT MemberID,
              ReimbursementAccountId,
              FundingSubaccount,
              CASE WHEN IsReassigned = 1 THEN '' ELSE BenefitGroupCode END AS BenefitGroupCode,
              CASE WHEN IsReassigned = 1 THEN 'Reassigned' ELSE BenefitGroupName END AS BenefitGroupName,
              FORMAT(BGStartDate, 'M/d/yyyy') AS BGStartDate,
              FORMAT(BGEndDate, 'M/d/yyyy') AS BGEndDate,
              IsReassigned,
              COALESCE (NULLIF (EmployeeID, ''), SSN) AS EmployeeID,
              Department,
              MemberName,
              AccountType,
              TotalRolloverDeposit,
              TotalElection,
              TotalDeposit,
              TotalClaims,
              TotalAllowed,
              TotalAllowedFromOtherRA,
              TotalDenied,
              TotalPaid,
              TotalFees,
              TotalFeesFromOtherRA,
              PlanBalance,
              YTDBalance,
              CoverageStart,
              CoverageEnd,
              HasLinkedAccounts,
		PlanTyingRolloversHRA
              FROM   #Final;
       END
       ELSE
       BEGIN
              IF @UnmaskIdentifiers = 1
              BEGIN
                     INSERT INTO [#{EmployerDataBase}].[dbo].[MembersUnMaskedSSNLog] ([LoginID], [EmployerID], [CoverageIntentID], [MemberID], [RequestSource], [AccessDate], [AccessType])
                     SELECT @UserName,
                            @EmployerID,
                            CoverageIntentId,
                            F.MemberID,
                            'Plan Summary Report',
                            GETDATE(),
                            'View/Download'
                     FROM   #Final AS F
                     WHERE  REPLACE(COALESCE (NULLIF (F.EmployeeID, ''), F.SSN), '-', '') = REPLACE(F.SSN, '-', '');
                     
                     SELECT MemberID,
                            CASE WHEN IsReassigned = 1 THEN '' ELSE BenefitGroupCode END AS BenefitGroupCode,
                            CASE WHEN IsReassigned = 1 THEN 'Reassigned' ELSE BenefitGroupName END AS BenefitGroupName,
                            FORMAT(BGStartDate, 'M/d/yyyy') AS BGStartDate,
                            FORMAT(BGEndDate, 'M/d/yyyy') AS BGEndDate,
                            IsReassigned,
                            COALESCE (NULLIF (EmployeeID, ''), SSN) AS EmployeeID,
                            Department,
                            MemberName,
                            AccountType,
                            TotalRolloverDeposit,
                            TotalElection,
                            TotalDeposit,
                            TotalClaims,
                            TotalAllowed,
                            TotalAllowedFromOtherRA,
                            TotalDenied,
                            TotalPaid,
                            TotalFees,
                            TotalFeesFromOtherRA,
                            PlanBalance,
                            YTDBalance,
                            CoverageStart,
                            CoverageEnd,
                            HasLinkedAccounts
                     FROM   #Final AS F;
              END
              ELSE
              BEGIN
                     SELECT MemberID,
                            ReimbursementAccountId,
                            FundingSubaccount,
                            CASE WHEN IsReassigned = 1 THEN '' ELSE BenefitGroupCode END AS BenefitGroupCode,
                            CASE WHEN IsReassigned = 1 THEN 'Reassigned' ELSE BenefitGroupName END AS BenefitGroupName,
                            FORMAT(BGStartDate, 'M/d/yyyy') AS BGStartDate,
                            FORMAT(BGEndDate, 'M/d/yyyy') AS BGEndDate,
                            IsReassigned,
                            CASE WHEN (REPLACE(F.EmployeeId, '-', '') = REPLACE(SSN, '-', '')) THEN 'XXX-XX-' + RIGHT(F.SSN, 4) ELSE COALESCE (NULLIF (F.EmployeeID, ''), 'XXX-XX-' + RIGHT(F.SSN, 4)) END AS EmployeeId,
                            Department,
                            MemberName,
                            AccountType,
                            TotalRolloverDeposit,
                            TotalElection,
                            TotalDeposit,
                            TotalClaims,
                            TotalAllowed,
                            TotalAllowedFromOtherRA,
                            TotalDenied,
                            TotalPaid,
                            TotalFees,
                            TotalFeesFromOtherRA,
                            PlanBalance,
                            YTDBalance,
                            CoverageStart,
                            CoverageEnd,
                            HasLinkedAccounts,
                            PlanTyingRolloversHRA
                     FROM   #Final AS F;
              END
       END
       -- Remove Temporal Tables
       DROP TABLE #RAs;
       DROP TABLE #Final;
END