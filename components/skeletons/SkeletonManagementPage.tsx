// components/skeletons/SkeletonManagementPage.tsx

import { motion } from "framer-motion"

const shimmerAnimation = {
  initial: {
    backgroundPosition: "-468px 0"
  },
  animate: {
    backgroundPosition: ["468px 0", "-468px 0"]
  }
}

const SkeletonManagementPage = () => {
  return (
    <div className="w-full mt-4">
      {/* Header con búsqueda y botones */}
      <div className="w-full mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <motion.div 
            className="w-1/3 h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-blue-600 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header de la tabla */}
        <div className="grid grid-cols-9 gap-4 py-3 border-b bg-gray-50">
          <div className="w-6 h-6 bg-gray-200 rounded ml-4" />
          <motion.div 
            className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.1
            }}
          />
          <motion.div 
            className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.2
            }}
          />
          <motion.div 
            className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.3
            }}
          />
          <motion.div 
            className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded col-span-2"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.4
            }}
          />
          <motion.div 
            className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded col-span-2"
            variants={shimmerAnimation}
            initial="initial"
            animate="animate"
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: 0.5
            }}
          />
          <div className="w-6 h-6 bg-gray-200 rounded justify-self-end mr-4" />
        </div>

        {/* Filas de la tabla */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="grid grid-cols-9 gap-4 py-3 border-b hover:bg-gray-50">
            <div className="w-6 h-6 bg-gray-100 rounded ml-4" />
            <motion.div 
              className="h-[48px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded"
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.1
              }}
            />
            <motion.div 
              className="h-[48px] w-24 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded"
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2
              }}
            />
            <div className="flex items-center justify-center">
              <motion.div 
                className="h-[48px] w-16 bg-gradient-to-r from-green-100 via-green-50 to-green-100 rounded-full"
                variants={shimmerAnimation}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.3
                }}
              />
            </div>
            <motion.div 
              className="h-[48px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded col-span-2"
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.4
              }}
            />
            <motion.div 
              className="h-[48px] bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded col-span-2"
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.5
              }}
            />
            <div className="w-6 h-6 bg-gray-100 rounded justify-self-end mr-4" />
          </div>
        ))}

        {/* Footer de la tabla */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <motion.div 
              className="w-48 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
              variants={shimmerAnimation}
              initial="initial"
              animate="animate"
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonManagementPage