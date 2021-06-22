import { Card,CardContent, FormControl, Menu, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './infoBox';
import LineChart from './LineChart';
import Map from './Map';
import Table from './Table';
import {sort} from './util';
import "leaflet/dist/leaflet.css";
import './infoBox.css';
import {prettyPrintStat}from './util';
function App() {
  const [countries,setCountries]=useState([]);
  const [country,setCountry]=useState("worldwide");
  const [countryInfo,setCountryInfo]=useState([]);
  const [tableData,setTableData]=useState([]);
  const [mapCenter,setmapCenter]=useState([34.80746, -40.4796]);
  const [mapZoom, setmapZoom] = useState(3);
  const [mapCountries, setmapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");
  //on country change
  const onCountryChange=async (event)=>{
      const countryCode=event.target.value;
      const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setCountry(countryCode);
            setCountryInfo(data);
            setmapCenter([data.countryInfo.lat, data.countryInfo.long]);
            setmapZoom(4);
          });
  }

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((res)=>res.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  },[])
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/countries')
    .then((res)=>res.json())
    .then((data)=>{

      const countries=data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
      ));
      const sortedData=sort(data);
      setTableData(sortedData);
      setCountries(countries);
      setmapCountries(data);
    })
  },[]);
  return (
    <div className="app">
        <div className="app_left">
          <div className="app_header">
            <h1>covid-19 tracker</h1>
            <FormControl className="app_dropdown">
                <Select
                  variant="outlined"
                  value={country}
                  onChange={onCountryChange}
                >
                  <MenuItem value="worldwide">World Wide</MenuItem>
                  {
                    countries.map((country)=>(
                      <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                  }
                  
                </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
            isGrey={false}
            isRed={true} 
            onClick={e=>setcasesType("cases")}
            active={casesType=="cases"}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)} 
            />
            <InfoBox
            isGrey={false}
            isRed={false}
            active={casesType=="recovered"}
            onClick={e=>setcasesType("recovered")}
            title="recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            />
            <InfoBox
            isGrey={true}
            isRed={false}
            active={casesType=="deaths"}
            onClick={e=>setcasesType("deaths")}
            title="deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            />
          </div>
          <div className="app_map">
            <Map countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={casesType}/>
          </div>
        </div>
        
             <Card className="app_right">
               <CardContent>
                  <h3>Live Cases by Country</h3>
                  <Table countries={tableData}/>
                  <h3>Worldwide new cases</h3> 
                  <LineChart caseType={casesType}/>
               </CardContent>
              </Card>     
    </div>
  );
}

export default App;
