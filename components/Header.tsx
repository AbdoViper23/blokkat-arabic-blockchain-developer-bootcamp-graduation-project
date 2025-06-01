export const Header=()=>{
    return(
        <div className="flex justify-between items-center mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🚗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Plate NFT Platform
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Mint and search license plate NFTs
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle Button */}
            <w3m-button />
            <w3m-network-button />
          </div>
        </div>
    )
}