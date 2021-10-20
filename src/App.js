import React,{useState,useLayoutEffect,useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { Sentry } from "react-activity";
import "react-activity/dist/Sentry.css";
import { SRLWrapper } from "simple-react-lightbox";
function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

function App() {
  
  const forceUpdate = useForceUpdate();

  const [data,setData]=useState([])

  const [products,setProducts]=useState([])
  const [kategoriler,setKategoriler]=useState([])
  const [renkler,setRenkler]=useState([])
  const [selecteds,setSelecteds]=useState([])
  const [kategoriVisible,setKategoriVisible]=useState(false)
  const [renkVisible,setRenkVisible]=useState(false)

  const [agirlik, setAgirlik] =  useState([1,5000]);
  const [yukseklik, setYukseklik] =  useState([1,3000]);
  const [genislik, setGenislik] =  useState([1,3000]);
  const [sizes,setSizes]=useState({hacim_min:0,hacim_max:10,agirlik_min:0,agirlik_max:10,yukseklik_min:0,yukseklik_max:10})
  const resetFilter = () => {
    
    if(sizes!=null){
      setAgirlik([sizes.hacim_min,sizes.hacim_max])
      setYukseklik([sizes.yukseklik_min,sizes.yukseklik_max])
      setGenislik([sizes.genislik_min,sizes.genislik_max])
    }
    setKategoriVisible(true)
    setRenkVisible(false)
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
    setSelecteds(kategoriler.map(function(e){
      return 'kategori:'+e
    })
    /*.concat(renkler.map(function(d){
      return 'renk:'+d
    }))*/
    )
  }, [renkler,kategoriler])

  useEffect(() => {
    let filterResult=products.filter(item=>((item.hacim*1)>=agirlik[0] && (item.hacim*1)<=agirlik[1]) ? true : false)
    filterResult=filterResult.filter(item=>((item.genislik*1)>=genislik[0] && (item.genislik*1)<=genislik[1]) ? true : false)
    filterResult=filterResult.filter(item=>((item.yukseklik*1)>=yukseklik[0] && (item.yukseklik*1)<=yukseklik[1]) ? true : false)
    filterResult=filterResult.filter(item=>{
      if(selecteds.indexOf(('renk:'+item.renk))!=-1){
        return true
      }else if(selecteds.indexOf(('kategori:'+item.kategori))!=-1){
        return true
      }else{
        return false
      }
    })
    
    setData(filterResult)
    //console.log("filterResult",filterResult,agirlik[0],agirlik[1])

  }, [agirlik,yukseklik,genislik,selecteds])
  

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

          <div className="kategoriler" onClick={()=>setKategoriVisible(!kategoriVisible)}>
            <h1>Kategoriler <strong ><i className={kategoriVisible ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></strong></h1>
            <div className="kategori lister" style={{display:kategoriVisible ? 'block' : 'none'}}>
              {
                kategoriler.map((kategori,index)=>{
                  return(
                    <React.Fragment key={`kategori-${index}`}>
                    
                    <label >
                      <input type="checkbox" defaultChecked={true} onChange={(e)=>{
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

          <div className="kategoriler" onClick={()=>setRenkVisible(!renkVisible)}>
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
          </div>

          <div className="kategoriler">
            <h1>Ağırlık <span>(gr)</span></h1>
            <div className="kategori">
              <div>
                <input type="text" value={agirlik[0]} onChange={(e)=>setAgirlik([e.target.value,agirlik[1]])} />
                <input type="text" value={agirlik[1]} onChange={(e)=>setAgirlik([agirlik[0],e.target.value])} />
              </div>
              <Slider
                value={agirlik}
                min={(sizes.hacim_min)}
                max={(sizes.hacim_max)}
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
            <SRLWrapper>
            {
              data.map((element,index)=>{
                return (
                  <React.Fragment key={`product-${index}`}>
                  
                  <div className="productCard">
                    <img src={element.resim} className="productImage" />
                    <div className="productTitle">
                      {element.baslik}
                    </div>
                    <div className="productProperties">
                      <div><i className="fa fa-arrows-alt-h"></i> {element.genislik} </div>
                      <div><i className="fa fa-arrows-alt-v"></i> {element.yukseklik} </div>
                      <div><i className="fa fa-balance-scale-left"></i> {element.hacim} </div>
                      <div><i className="fa fa-palette"></i> {element.renk} </div>
                    </div>
                  </div>
                  </React.Fragment>
                )
              })
            }
            </SRLWrapper>
          }
        </div>
      </div>
    }
    </>
    
  );
}

export default App;
