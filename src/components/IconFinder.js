import React, { useRef, useState } from 'react'
import { classInput } from './MainConfig';
import IconListSearch from '../../public/arrayType_fontAwesomeIcon.json';
import Fuse from 'fuse.js'
import useLanguageSwitcher from './hooks/useLanguageSwitcher';
function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
const calculateSimilarity = (s1, s2) => {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
const ItemSelector = ({onClick=()=>{}, icon, style, page, perpage, itemCount})=>{
  if((page - 1) * perpage <= itemCount && (page) * perpage > itemCount){
  return (
    <div onClick={onClick} className='flex flex-row items-center justify-center bg-golden-400 hover:bg-golden-700 cursor-pointer text-black p-2 w-[2.8rem] h-[2.8rem] text-xl rounded-full'>
      <i className={`${style} ${icon}`} />
    </div>
  )
  }else{
    return (
      <></>
    )
  }
}
const algoliaSearch = (searchTerm, data, userDefinedStyles, searchableAttributes) => {
  console.log("search with: ",searchTerm,data);
  const options = {
    keys: searchableAttributes,
    threshold: 0.3, // Adjust the threshold as needed for accuracy
    includeScore:true,
    includeMatches:true
  };

  const fuse = new Fuse(data, options);
  const results = fuse.search(searchTerm);
  let filteredData = results;
  console.log("Result search is:",filteredData);
  if (Array.isArray(userDefinedStyles) && userDefinedStyles.length > 0) {
    filteredData = results.filter(item => {
      // console.log(item.item.style);
      return userDefinedStyles.includes(item.item.style);
    });
  }
  return filteredData;
}
const IconFinder = ({current,cancelHandle = ()=>{},successHandle= ()=>{},styleIcon="all",heightDisabled=false}) => {
    const [searchParameter,setSearchParameter] = useState("");
    const refInput = useRef(null);
    const [lang,setLang] = useLanguageSwitcher();
    const searchableAttributes = ["label", "keywords"];
    const [searchResults,setSearchResults] = useState([]);
    const [isSearch,setIsSearch] = useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalItem,setTotalItem] = useState(0);
    const [isSearchTermDefined,setIsSearchTermDefined] = useState(false);
    const [totalPage,setTotalPage] = useState(0);
    const toPrefixFA = {
      "classicregular":"far",
      "classicsolid":"fas",
      "classiclight":"fal",
      "classicthin":"fat",
      "classicduotone":"fad",
      "sharpsolid":"fas fa-sharp",
      "sharpregular":"far fa-sharp",
      "sharplight":"fal fa-sharp",
      "sharpthin":"fat fa-sharp",
      "brands":"fab"
    }
    const perpage = 45;
    const handleSearch = ()=>{
        let searchTerm = refInput.current.value;
        console.log("Search Value:",searchTerm);
        if(searchTerm == ""){
          console.log("Search is null or empty.");
          setIsSearch(false);
          setIsSearchTermDefined(false);
          setTotalItem(1);
          return;
        }
        setIsSearch(true);
        setSearchParameter(searchTerm);
        // console.log("Search:",refInput.current.value);
        // console.log("Search:",searchParameter);
        let results = algoliaSearch(searchTerm,IconListSearch,styleIcon,searchableAttributes);
        if(results.length == 0){
          console.log("Results is empty.");
          setIsSearch(false);
          setIsSearchTermDefined(false);
          setTotalItem(0);
          return;
        }
        setIsSearchTermDefined(true);
        setSearchResults(results);
        setTotalItem(results.length);
        setCurrentPage(1);
        setTotalPage(Math.ceil(results.length / perpage));
        // console.log(results.length);
    }
    const handleKeyDown = (e) => {
      if (e.code === "Enter") {
        handleSearch();
      }
    };
    
    // console.log(IconListSearch);
  return (
    <div className={`top-0 left-0 duration-300 transition-all 
    w-full ${heightDisabled ? "mt-10" : "h-screen"} z-130 flex flex-row justify-center items-center col-span-2`}>
            <div className='w-[90%] flex flex-col justify-center items-center font-bold text-black dark:text-white'>
            <h1  className='text-[2em] px-4 font-bold w-full text-center'>Add Icon</h1>
                <div className={`mt-2 left-0 right-0 transition-all duration-1000 w-[85%] mx-auto 
                bg-pinkDashboard/40 rounded-xl betweenExtraSmall2:p-3
                flex flex-col justify-between items-start p-4 gap-4
                px-8`}>
                    {/* <div className={`w-full flex flex-row justify-start`}>
                        <div className='text-black dark:text-white flex flex-row gap-2 items-center'>
                            <div className='text-2xl betweenExtraSmall2:text-xl text-black'>
                                <i className='fal fa-magnifying-glass' />
                            </div>
                            <div className=''>
                                <div className='font-semibold text-2xl betweenExtraSmall2:tracking-tight 
                                betweenExtraSmall2:text-xl text-black'>Find Icon</div>
                                <div className='font-medium text-sm betweenExtraSmall2:text-xs'>Make it unique using icon.</div>
                            </div>
                        </div>
                    </div> */}
                    <div className='w-full h-max'>
                        <div className="flex">
                            <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">{lang == "th_th" ? "อีเมลของคุณ" : "Your Email"}</label>
                            <div className="relative w-full">
                                <input ref={refInput} 
                                type="search" id="search-dropdown" 
                                onKeyDown={handleKeyDown}
                                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg
                                 border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500
                                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search" required />
                                <button onClick={handleSearch} type="submit" className="absolute top-0 right-0 p-2.5 h-full text-sm font-medium text-white bg-blue-700 rounded-r-md border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <i className='fal fa-magnifying-glass' />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={`text-red-500 italic font-medium ${isSearchTermDefined ? "hidden" : ""}`}>*&nbsp;
                    {
                      isSearchTermDefined ? "" : totalItem == 0 ? (lang == "th_th" ? "ไม่พบ" : 'Not found') : (lang == "th_th" ? "การค้นหาว่างเปล่า" : "Search is blank") 
                    }
                    </div>
                    {
                      isSearch ? 
                      <>
                        <div className='flex flex-row justify-center items-center w-full'>
                          <div className='overflow-x-hidden overflow-y-scroll max-h-52 h-52 scrollbar pr-1'>
                            <div className='grid grid-cols-11 semiLarge:grid-cols-9 afterSmall:grid-cols-7 sm:grid-cols-6 3xs:grid-cols-4 xs:grid-cols-5 place-items-center gap-2 w-full'>
                              {
                                searchResults.map((i,j)=>{
                                  // console.log(i.item);
                                  return (
                                    <ItemSelector
                                    page={currentPage}
                                    perpage={perpage}
                                    itemCount={j + 1}
                                    key={i.item.name+"_"+i.item.style}
                                    style={toPrefixFA[i.item.style]} 
                                    icon={"fa-"+i.item.name}
                                    onClick={()=>{ successHandle(toPrefixFA[i.item.style]+" "+"fa-"+i.item.name); }} />
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                        <div className='flex'></div>
                        <div className='grid grid-cols-6 w-full place-items-center'>
                          <div onClick={()=>{
                            let cp = currentPage;
                            if(cp == 1){

                            }else{
                              setCurrentPage(cp - 1);
                            }
                          }} className={`${currentPage == 1 ? "bg-red-700 select-none cursor-not-allowed grayscale" : "bg-golden-500 cursor-pointer"} aspect-square rounded-full w-8 h-8 flex flex-row items-center justify-center`}><i className='fal fa-arrow-left' /></div>
                          <div className='flex flex-row items-center justify-center col-span-4'>
                            {currentPage} / {totalPage}
                          </div>
                          <div onClick={()=>{
                            let cp = currentPage;
                            if(cp == totalPage){

                            }else{
                              setCurrentPage(cp + 1);
                            }
                          }} className={`${currentPage == totalPage ? "bg-red-700 select-none cursor-not-allowed grayscale" : "bg-golden-500 cursor-pointer"} aspect-square rounded-full w-8 h-8 flex flex-row items-center justify-center`}><i className='fal fa-arrow-right' /></div>
                        </div>
                      </>
                       : ""
                    }
                    {/* <div className='flex flex-row gap-2 w-full'> */}
                    <div className='grid grid-cols-2 gap-2 w-full mt-5'>
                        <div onClick={cancelHandle} 
                        className='text-center w-full py-1 -translate-y-3 px-3 
                        -mb-3 hover:bg-red-800 cursor-pointer bg-amber-600 rounded-full text-white'> 
                            {lang == "th_th" ? "กลับไป" : "Go back!"}
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
  )
}

export default IconFinder