import React,{useState} from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

function App() {

  const [kategoriVisible,setKategoriVisible]=useState(true)
  const [renkVisible,setRenkVisible]=useState(false)

  const [agirlik, setAgirlik] =  useState([1,5000]);
  const [yukseklik, setYukseklik] =  useState([1,3000]);
  const [genislik, setGenislik] =  useState([1,3000]);
  
  // Changing State when volume increases/decreases
  const resetFilter = () => {
    setAgirlik([0,5000])
    setYukseklik([0,3000])
    setGenislik([0,3000])
    setKategoriVisible(true)
    setRenkVisible(false)
  };

  return (
    <div className="App">
      <div className="filter">
        <button onClick={()=>resetFilter()}>Filtreyi Temizle</button>

        <div className="kategoriler" onClick={()=>setKategoriVisible(!kategoriVisible)}>
          <h1>Kategoriler <strong ><i className={kategoriVisible ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></strong></h1>
          <div className="kategori lister" style={{display:kategoriVisible ? 'block' : 'none'}}>
            <label>
              <input type="checkbox" /> Cam Şişe
            </label>
            <label>
              <input type="checkbox" /> Cam Şişe
            </label>
            <label>
              <input type="checkbox" /> Cam Şişe
            </label>
            <label>
              <input type="checkbox" /> Cam Şişe
            </label>
            <label>
              <input type="checkbox" /> Cam Şişe
            </label>
          </div>
        </div>

        <div className="kategoriler" onClick={()=>setRenkVisible(!renkVisible)}>
          <h1>Renkler<strong  ><i className={renkVisible ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></strong></h1>
          <div className="kategori lister" style={{display:renkVisible ? 'block' : 'none'}}>
            <label>
              <input type="checkbox" /> Yeşil
            </label>
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
              min={1}
              max={5000}
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
              min={1}
              max={3000}
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
              min={1}
              max={3000}
              onChange={(event,newValue)=>setGenislik(newValue)}
              valueLabelDisplay="off"
            />
          </div>
        </div>


      </div>
      <div className="products">
        
      </div>
    </div>
  );
}

export default App;
