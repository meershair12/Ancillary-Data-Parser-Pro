import { useState } from "react";
import { Trash2, X } from "lucide-react";

export default function FloatingDeleteButton({setSelectedIds,isSelect=false,setIsSelect,handleDelete,selectedCount=0,isDeleting, setDeleting}) {
 
  return (
    <div className="fixed bottom-6 flex gap-2 flex-row-reverse right-[50%] z-1000 items-center" style={{transform:"translate(50%)"}}>
      {/* Floating Delete Button */}
      <div className={`transition-all duration-300 ease-out transform z-10000 ${
        isSelect 
          ? 'translate-y-0 opacity-100 scale-100 cursor-pointer' 
          : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="relative z-1000">
          {/* Main Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`  cursor-pointer
              group relative flex items-center gap-3 px-5 py-4 
              bg-gradient-to-r from-red-500 to-red-600 
              text-white font-medium rounded-2xl shadow-lg 
              hover:from-red-600 hover:to-red-700 
              hover:shadow-xl hover:scale-105
              active:scale-95
              transition-all duration-200 ease-out
              disabled:opacity-70 disabled:cursor-not-allowed
              disabled:hover:scale-100 disabled:hover:shadow-lg
              min-w-[120px] z-1 justify-center 
            `}
          >
            {isDeleting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Delete {selectedCount > 0 && `(${selectedCount})`}</span>
              </>
            )}
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-20 bg-white transition-opacity duration-150"></div>
          </button>
          
            
          {/* Floating Animation Ring */}
          <div className={`
            absolute inset-0 rounded-2xl border-2 border-red-400 
            opacity-30 animate-pulse
            ${isSelect ? 'block' : 'hidden'}
          `}></div>

          {/* Selected Count Badge */}
          {selectedCount > 0 && (
            <div className="absolute -top-2 z-10 border -right-2 bg-red-600  text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
              {selectedCount}
            </div>
          )}
        </div>
         

        {/* Background Blur Overlay */}
        <div className="absolute inset-0 -z-10 bg-black bg-opacity-10 rounded-2xl blur-xl scale-110"></div>
      </div>

      {/* Cancel Selection Button (appears when selecting) */}
      <div className={`transition-all duration-300 ease-out transform ${
        isSelect 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-16 opacity-0 scale-95 pointer-events-none'
      }`}>
        
        <button
          onClick={() => {
            setDeleting(false)
            setIsSelect(false);
            setSelectedIds({type:"include", ids: new Set([])})
          }}
          className="
            flex items-center gap-2 px-4 py-3
            bg-white text-gray-700 font-medium rounded-xl 
            shadow-lg border border-gray-200
            hover:bg-gray-50 hover:shadow-xl hover:scale-105
            active:scale-95
            transition-all duration-200 ease-out
          "
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Cancel</span>
        </button>
      </div>
    </div>
  );
}