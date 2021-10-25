import React,{useState,useLayoutEffect,useEffect,useRef} from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}


function App() {
  
  const forceUpdate = useForceUpdate();

  const [data,setData]=useState([])

  
  const refcheckboxs = useRef([]);

  const [activePage,setActivePage] =useState(1);


  const [search,setSearch]=useState("")

  const [products,setProducts]=useState([])
  const [kategoriler,setKategoriler]=useState([])
  const [renkler,setRenkler]=useState([])
  const [selecteds,setSelecteds]=useState([])
  const [kategoriVisible,setKategoriVisible]=useState(true)
  const [renkVisible,setRenkVisible]=useState(false)

  const [agirlik, setAgirlik] =  useState([1,5000]);
  const [yukseklik, setYukseklik] =  useState([1,3000]);
  const [genislik, setGenislik] =  useState([1,3000]);
  const [sizes,setSizes]=useState({hacim_min:0,hacim_max:10,agirlik_min:0,agirlik_max:10,yukseklik_min:0,yukseklik_max:10})

  const handlePageChange=(pageNumber)=>{
    setActivePage(pageNumber)
  }

  const resetFilter = () => {
    
    if(sizes!=null){
      setAgirlik([sizes.hacim_min,sizes.hacim_max])
      setYukseklik([sizes.yukseklik_min,sizes.yukseklik_max])
      setGenislik([sizes.genislik_min,sizes.genislik_max])
    }
    setSearch("")
    setKategoriVisible(true)
    setRenkVisible(false)
    setSelecteds([])
    refcheckboxs.current.map((e)=>{
      e.checked=false
    })
  };

  useLayoutEffect(() => {
    fetchData()
  }, [])
  const fetchData=()=>{
    fetch('https://cam.mucahit.dehasoft.com.tr/getproducts.php').then((response)=>response.json()).then(response=>{ setData(response); setProducts(response) })
    fetch('https://cam.mucahit.dehasoft.com.tr/getcategories.php').then((response)=>response.json()).then(response=>{ setKategoriler(response);  })
    fetch('https://cam.mucahit.dehasoft.com.tr/getcolors.php').then((response)=>response.json()).then(response=>{ setRenkler(response);   })
    fetch('https://cam.mucahit.dehasoft.com.tr/getsizes.php').then((response)=>response.json()).then(response=>{ setSizes(response); 
    setAgirlik([response.hacim_min,response.hacim_max])
    setYukseklik([response.yukseklik_min,response.yukseklik_max])
    setGenislik([response.genislik_min,response.genislik_max])
    })
  }
  
 

  useEffect(() => {
    let filterResult=products.filter(item=>((item.hacim*1)>=agirlik[0] && (item.hacim*1)<=agirlik[1]) ? true : false)
    filterResult=filterResult.filter(item=>((item.genislik*1)>=genislik[0] && (item.genislik*1)<=genislik[1]) ? true : false)
    filterResult=filterResult.filter(item=>((item.yukseklik*1)>=yukseklik[0] && (item.yukseklik*1)<=yukseklik[1]) ? true : false)
    if(search!=""){
      filterResult=filterResult.filter(item=> item.baslik.toUpperCase().replaceAll(" ","").indexOf(search.toUpperCase().replaceAll(" ",""))!=-1 ? true : false )
    }
    if(selecteds.length>0){
      filterResult=filterResult.filter(item=>{
        if(selecteds.indexOf(('renk:'+item.renk))!=-1){
          return true
        }else if(selecteds.indexOf(('kategori:'+item.kategori))!=-1){
          return true
        }else{
          return false
        }
      })
    }
    
    
    setData(filterResult)
    //console.log("filterResult",filterResult,agirlik[0],agirlik[1])

  }, [agirlik,yukseklik,genislik,selecteds,search])
  

  return (
    <>
    {
      (products.length==0 ||kategoriler.length==0 || renkler.length==0 || sizes=={hacim_min:0,hacim_max:10,agirlik_min:0,agirlik_max:10,yukseklik_min:0,yukseklik_max:10} ) ? 
       <div className="loading">
         <Sentry size={250} />
       </div>
       :
      <div className="App">
        
        <div className="filter">
          <button onClick={()=>resetFilter()}>Filtreyi Temizle</button>

          <div className="kategoriler">
            <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Ürün adı ara..." />
          </div>

          <div className="kategoriler" onClick={()=>setKategoriVisible(!kategoriVisible)}>
            <h1>Kategoriler <strong ><i className={kategoriVisible ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></strong></h1>
            <div className="kategori lister" style={{display:kategoriVisible ? 'block' : 'none'}}>
              {
                kategoriler.map((kategori,index)=>{
                  return(
                    <React.Fragment key={`kategori-${index}`}>
                    
                    <label >
                      <input type="checkbox" ref={e=>refcheckboxs.current[index]=e} defaultChecked={false} onChange={(e)=>{
                        if(e.target.checked==true){
                          setSelecteds([...selecteds,'kategori:'+kategori])
                        }else{
                          setSelecteds(selecteds.filter(item=> item=='kategori:'+kategori ? false : true))
                        }
                      }} /> {kategori}
                    </label>
                    </React.Fragment>
                  )
                })
              }
            </div>
          </div>

          {/* <div className="kategoriler" onClick={()=>setRenkVisible(!renkVisible)}>
            <h1>Renkler<strong  ><i className={renkVisible ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></strong></h1>
            <div className="kategori lister" style={{display:renkVisible ? 'block' : 'none'}}>
              {
                renkler.map((renk,index)=>{
                  return(
                    <label key={`renk-${index}`}>
                      <input type="checkbox" defaultChecked={false} onChange={(e)=>{
                        if(e.target.checked==true){
                          setSelecteds([...selecteds,'renk:'+renk])
                        }else{
                          setSelecteds(selecteds.filter(item=> item=='renk:'+renk ? false : true))
                        }
                      }} /> {renk}
                    </label>
                  )
                })
              }
              
            </div>
          </div> */}

          <div className="kategoriler">
            <h1>Hacim <span>(cc)</span></h1>
            <div className="kategori">
              <div>
                <input type="text" value={agirlik[0]} onChange={(e)=>setAgirlik([e.target.value,agirlik[1]])} />
                <input type="text" value={agirlik[1]} onChange={(e)=>setAgirlik([agirlik[0],e.target.value])} />
              </div>
              <Slider
                value={agirlik}
                min={(sizes.hacim_min)}
                max={(sizes.hacim_max)}
                style={{color:'#007f7f'}}
                onChange={(event,newValue)=>setAgirlik(newValue)}
                valueLabelDisplay="off"
              />
            </div>
          </div>
          

           <div className="kategoriler">
            <h1>Yükseklik <span>(mm)</span></h1>
            <div className="kategori">
              <div>
                <input type="text" value={yukseklik[0]} onChange={(e)=>setYukseklik([e.target.value,yukseklik[1]])} />
                <input type="text" value={yukseklik[1]} onChange={(e)=>setYukseklik([yukseklik[0],e.target.value])} />
              </div>
              
              <Slider
                value={yukseklik}
                min={sizes.yukseklik_min}
                max={sizes.yukseklik_max}
                style={{color:'#007f7f'}}
                onChange={(event,newValue)=>setYukseklik(newValue)}
                valueLabelDisplay="off"
              />
            </div>
          </div>


          <div className="kategoriler">
            <h1>Genişlik <span>(mm)</span></h1>
            <div className="kategori">
              <div>
                <input type="text" value={genislik[0]} onChange={(e)=>setGenislik([e.target.value,genislik[1]])} />
                <input type="text" value={genislik[1]} onChange={(e)=>setGenislik([genislik[0],e.target.value])} />
              </div>
              <Slider
                value={genislik}
                min={sizes.genislik_min}
                max={sizes.genislik_max}
                style={{color:'#007f7f'}}
                onChange={(event,newValue)=>setGenislik(newValue)}
                valueLabelDisplay="off"
              />
            </div>
          </div> 


        </div>
        <div className="products">
          {
            data.length==0 ?
            <div className="loading" style={{fontSize:26}}>
              <center>Ürün bulunamadı</center><br/>
            </div>
            :
            <div className="listerp">
            {
              data.map((element,index)=>{
                return (
                  <React.Fragment itemClass="page-item" linkClass="page-link" key={`product-${index}`}>
                  
                    <div className="productCard"  onClick={()=>window.location='https://cam.mucahit.dehasoft.com.tr/urunlerimiz.php?id='+element.id}>
                      <img src={element.resim} className="productImage" />
                      <div className="productTitle">
                        {element.baslik}
                      </div>
                      <div className="productProperties">
                        <div><i className="fa fa-arrows-alt-h"></i> {element.genislik} <span>mm</span> </div>
                        <div><i className="fa fa-arrows-alt-v"></i> {element.yukseklik} <span>mm</span> </div>
                        <div className="full"><i className="fa fa-weight"></i> {element.hacim} <span>cc</span> </div>
                      </div>
                    </div>

                  </React.Fragment>
                )
              })
            }
            
            </div>
          }
        </div>
      </div>
    }
    </>
    
  );
}

export default App;
