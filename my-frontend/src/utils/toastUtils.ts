// Define toast options with Tailwind classes to mimic the bubbly design
const toastOptions = {
        classes: {
        toast: 'group w-full max-w-md rounded-lg border-2 p-4 shadow-xl transition-all duration-300 flex items-start gap-3 backdrop-blur-sm',
        content: 'flex-1 flex flex-col min-w-0',
        icon: 'h-5 w-5 flex-shrink-0 mt-0.5',
        title: 'text-base font-bold text-gray-800 dark:text-white',
        description: 'text-sm text-gray-600 dark:text-gray-300 mt-1',
        actionButton: 'h-8 rounded-md px-3 text-xs font-medium mt-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white',
        cancelButton: 'h-8 rounded-md px-3 text-xs font-medium mt-2 border border-purple-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800',
        closeButton: 'absolute -right-2 -top-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110',

        // Light & Dark mode variants dengan gradient background seperti dashboard
        default: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-gray-600',

        success: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-green-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-gray-600 text-gray-800 dark:text-white [&>svg]:text-green-600 dark:[&>svg]:text-green-400',

        error: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900 border-red-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-gray-600 text-gray-800 dark:text-white [&>svg]:text-red-600 dark:[&>svg]:text-red-400',

        warning: 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 border-yellow-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-gray-600 text-gray-800 dark:text-white [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',

        info: 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-900 border-blue-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 text-gray-800 dark:text-white [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',

        loading: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-800 dark:text-white'
      }
};

// Your position value (e.g., 'top-center')
const positionValue = 'top-center'; // Adjust as needed

export { toastOptions, positionValue };
