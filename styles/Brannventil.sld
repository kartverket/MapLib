<sld:StyledLayerDescriptor version="1.0.0" 
    xmlns:sld="http://www.opengis.net/sld" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:gml="http://www.opengis.net/gml" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd"> 
  <sld:NamedLayer> 
    <sld:Name>Default</sld:Name> 
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml"> 
      <sld:Name/> 
      <sld:Title>tor</sld:Title> 
      <sld:Abstract>Presentasjon av VA-Kum</sld:Abstract> 
      <sld:IsDefault>1</sld:IsDefault> 
      <sld:FeatureTypeStyle> 
        <sld:Name>Default</sld:Name> 
        <sld:Rule> 
          <sld:Name>Stil for punkt</sld:Name> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>20000</MaxScaleDenominator> 
          <sld:PointSymbolizer> 
            <sld:Geometry> 
              <ogc:PropertyName>Geometri</ogc:PropertyName> 
            </sld:Geometry> 
			 <ogc:Filter> 
			<ogc:And>
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>KUM</ogc:Literal> 
            </ogc:PropertyIsEqualTo>          
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
			</ogc:And> 
			</ogc:Filter> 
            <sld:Graphic> 
              <sld:Mark> 
                <sld:WellKnownName>circle</sld:WellKnownName> 
                <sld:Fill> 
                  <sld:CssParameter name="fill"> 
                    <ogc:Literal>#CC0000</ogc:Literal> 
                  </sld:CssParameter> 
                </sld:Fill> 
                <sld:Stroke> 
                  <sld:CssParameter name="stroke"> 
                    <ogc:Literal>#000000</ogc:Literal> 
                  </sld:CssParameter> 
                  <sld:CssParameter name="stroke-width"> 
                    <ogc:Literal>1</ogc:Literal> 
                  </sld:CssParameter> 
                </sld:Stroke> 
              </sld:Mark> 
              <sld:Size> 
                <ogc:Literal>25.0</ogc:Literal> 
              </sld:Size> 
            </sld:Graphic> 
          </sld:PointSymbolizer> 
               <TextSymbolizer> 
         <Label> 
           <ogc:PropertyName>Navn</ogc:PropertyName> 
         </Label> 
         <Fill> 
           <CssParameter name="fill">#CC0000</CssParameter> 
         </Fill> 
       </TextSymbolizer> 
        </sld:Rule> 
        <sld:Rule> 
          <sld:Name>Stil for flate</sld:Name> 
          <ogc:Filter> 
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>SosiGeometriType</ogc:PropertyName> 
              <ogc:Literal>10</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>20000</MaxScaleDenominator> 
         <sld:PolygonSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Fill> 
           <sld:CssParameter name="fill">#cccccc</sld:CssParameter> 
         </sld:Fill> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#000000</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">1</sld:CssParameter> 
         </sld:Stroke> 
        </sld:PolygonSymbolizer> 
        </sld:Rule> 

        <sld:Rule> 
          <sld:Name>Stil for linje</sld:Name> 
          <ogc:Filter> 
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>SosiGeometriType</ogc:PropertyName> 
              <ogc:Literal>4</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>20000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#3333FF</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">3</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
       
      </sld:FeatureTypeStyle> 
    </sld:UserStyle> 
   </sld:NamedLayer> 
</sld:StyledLayerDescriptor>