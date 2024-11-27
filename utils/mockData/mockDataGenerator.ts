// utils/mockData/mockDataGenerator.ts

import { UserGenerator } from './generators/userGenerator'
import { ClientGenerator } from './generators/clientGenerator'
import { PolicyGenerator } from './generators/policyGenerator'
import { ClaimGenerator } from './generators/claimGenerator'
import { QuoteGenerator } from './generators/quoteGenerator'
import { TableViewsGenerator } from './generators/tableViewsGenerator'

export class MockDataGenerator {
  private tableViewGenerator = new TableViewsGenerator()
  private userGenerator = new UserGenerator()
  private clientGenerator = new ClientGenerator()
  private policyGenerator = new PolicyGenerator()
  private claimGenerator = new ClaimGenerator()
  private quoteGenerator = new QuoteGenerator()

  generateMockDataSet(counts: {
    tableViews?: number
    users?: number
    clients?: number
    policies?: number
    claims?: number
    quotes?: number
  } = {}) {
    const tableViews = this.tableViewGenerator.generate(counts.tableViews || 5)
    const users = this.userGenerator.generate(counts.users || 15)
    const clients = this.clientGenerator.generate(counts.clients || 120)
    const policies = this.policyGenerator.generate(counts.policies || 200)
    const claims = this.claimGenerator.generate(counts.claims || 50)
    const quotes = this.quoteGenerator.generate(counts.quotes || 75)

    return {
      tableViews,
      users,
      clients,
      policies,
      claims,
      quotes
    }
  }
}

export const mockData = new MockDataGenerator()