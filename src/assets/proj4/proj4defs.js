// Report errors
//proj4.reportError = function(msg) { alert('proj4.reportError:\n' + msg); };
//SWEREF99:
proj4.defs("EPSG:3006","+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3007","+proj=tmerc +lat_0=0 +lon_0=12 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3008","+proj=tmerc +lat_0=0 +lon_0=13.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3009","+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3010","+proj=tmerc +lat_0=0 +lon_0=16.5 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3011","+proj=tmerc +lat_0=0 +lon_0=18 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3012","+proj=tmerc +lat_0=0 +lon_0=14.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3013","+proj=tmerc +lat_0=0 +lon_0=15.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3014","+proj=tmerc +lat_0=0 +lon_0=17.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3015","+proj=tmerc +lat_0=0 +lon_0=18.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3016","+proj=tmerc +lat_0=0 +lon_0=20.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3017","+proj=tmerc +lat_0=0 +lon_0=21.75 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
proj4.defs("EPSG:3018","+proj=tmerc +lat_0=0 +lon_0=23.25 +k=1 +x_0=150000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
//UTM 31-35:
proj4.defs("EPSG:25832", '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs');
proj4.defs("EPSG:25833", '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs');
proj4.defs("EPSG:25835", '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs');
proj4.defs("EPSG:32631", "+proj=utm +zone=31 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32632", "+proj=utm +zone=32 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32633", "+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32634", "+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32635", "+proj=utm +zone=35 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
//ED50:
proj4.defs("EPSG:23028", "+proj=utm +zone=28 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23029", "+proj=utm +zone=29 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23030", "+proj=utm +zone=30 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23031", "+proj=utm +zone=31 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23032", "+proj=utm +zone=32 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23033", "+proj=utm +zone=33 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23034", "+proj=utm +zone=34 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23035", "+proj=utm +zone=35 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23036", "+proj=utm +zone=36 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23037", "+proj=utm +zone=37 +ellps=intl +units=m +no_defs");
proj4.defs("EPSG:23038", "+proj=utm +zone=38 +ellps=intl +units=m +no_defs");
//Mollweide:
proj4.defs("EPSG:54009", "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");