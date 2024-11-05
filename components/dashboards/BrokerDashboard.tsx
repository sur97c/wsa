import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  FileText,
  DollarSign,
  Award,
  AlertTriangle,
  ThumbsUp,
  Briefcase,
  LucideIcon,
} from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
  color: string;
}

interface GaugeData {
  name: string;
  value: number;
  fill: string;
  icon: LucideIcon;
  description: string;
}

interface GaugeCardProps {
  data: GaugeData;
}

interface AnimatedChartProps {
  children: ReactNode;
  title: string;
}

// Datos existentes...
const monthlyCommissions = [
  { name: "Ene", value: 45000 },
  { name: "Feb", value: 52000 },
  { name: "Mar", value: 48000 },
  { name: "Abr", value: 61000 },
  { name: "May", value: 55000 },
  { name: "Jun", value: 67000 },
];

const policyTypes = [
  { name: "Auto", value: 35 },
  { name: "Vida", value: 25 },
  { name: "Hogar", value: 20 },
  { name: "Salud", value: 20 },
];

// const userActivity = [
//   { name: "Lun", active: 120 },
//   { name: "Mar", active: 132 },
//   { name: "Mie", active: 125 },
//   { name: "Jue", active: 138 },
//   { name: "Vie", active: 142 },
//   { name: "Sab", active: 98 },
//   { name: "Dom", active: 85 },
// ];

// Nuevos datos para los gauges
const gaugeData = [
  {
    name: "Satisfacción",
    value: 95,
    fill: "#00C49F",
    icon: ThumbsUp,
    description: "Satisfacción de clientes",
  },
  {
    name: "Retención",
    value: 88,
    fill: "#0088FE",
    icon: Users,
    description: "Tasa de retención de clientes",
  },
  {
    name: "Reclamos",
    value: 15,
    fill: "#FF8042",
    icon: AlertTriangle,
    description: "Tasa de reclamos",
  },
  {
    name: "Cotizaciones",
    value: 75,
    fill: "#FFBB28",
    icon: Briefcase,
    description: "Conversión de cotizaciones",
  },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function BrokerDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  // const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    icon,
    trend,
    color,
  }) => {
    const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000; // 2 segundos
      const steps = 60;
      const stepValue = numericValue / steps;
      const stepDuration = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(current);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [numericValue]);

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-semibold">
              {value.startsWith("$") ? "$" : ""}
              {count.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              {value.endsWith("%") ? "%" : ""}
            </p>
            {trend && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className={`text-sm mt-2 ${
                  trend >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs mes anterior
              </motion.p>
            )}
          </div>
          <motion.div
            className={`p-3 rounded-full ${color}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {icon}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const GaugeCard: React.FC<GaugeCardProps> = ({ data }) => {
    const Icon = data.icon;
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress((data.value / 100) * circumference);
      }, 300);
      return () => clearTimeout(timer);
    }, [data.value, circumference]);

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-full h-full">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                stroke={data.fill}
                strokeWidth="8"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeLinecap="round"
                fill="none"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.text
                x="64"
                y="64"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold"
                fill={data.fill}
                transform="rotate(90 64 64)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {`${data.value}%`}
              </motion.text>
            </svg>
          </div>
          <motion.div
            className="mt-2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Icon
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: data.fill }}
            />
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <p className="text-sm text-gray-500">{data.description}</p>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Componente para gráficas animadas
  const AnimatedChart: React.FC<AnimatedChartProps> = ({ children, title }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
    >
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <motion.div
        className="h-80"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Comisiones Mensuales"
          value="$67,000"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          trend={12.5}
          color="bg-blue-500"
        />
        <KPICard
          title="Clientes Activos"
          value="1,234"
          icon={<Users className="h-6 w-6 text-white" />}
          trend={5.2}
          color="bg-green-500"
        />
        <KPICard
          title="Pólizas Vigentes"
          value="3,567"
          icon={<FileText className="h-6 w-6 text-white" />}
          trend={8.7}
          color="bg-purple-500"
        />
        <KPICard
          title="Tasa de Renovación"
          value="92%"
          icon={<Award className="h-6 w-6 text-white" />}
          trend={2.1}
          color="bg-yellow-500"
        />
      </motion.div>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gaugeData.map((data, index) => (
          <GaugeCard key={index} data={data} />
        ))}
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedChart title="Comisiones Mensuales">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCommissions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE">
                {monthlyCommissions.map((entry, index) => (
                  <motion.circle
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </AnimatedChart>

        <AnimatedChart title="Distribución de Pólizas">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={policyTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {policyTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  >
                    <motion.path
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                    />
                  </Cell>
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </AnimatedChart>
      </div>
    </motion.div>
  );
}
