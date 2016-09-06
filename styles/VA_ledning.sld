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
      <sld:Abstract>Presentasjon av VA-lednnger</sld:Abstract> 
      <sld:IsDefault>1</sld:IsDefault> 
      <sld:FeatureTypeStyle> 
        <sld:Name>Default</sld:Name> 
        <sld:Rule><sld:Name>Vannledning</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>VL</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#0000FF</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
      <sld:Rule><sld:Name>Spillvannsledning</sld:Name> 
                  <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>SP</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#00FF00</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">8 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Drensledning</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>DR</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#B68211</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">8 16 16 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
      <sld:Rule><sld:Name>Avl?p felles</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>AF</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#FF0000</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
      <sld:Rule><sld:Name>Overvannsledning</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>OV</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#000000</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">16 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Pumpeledning spillvann</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>PS</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
			<ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>			
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#00FF00</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
      <sld:Rule><sld:Name>Pumpeledning vann</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>PV</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#00B6B6</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Spyleledning vann</sld:Name> 
         <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>SL</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#0000FF</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">8 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Fjernvarmeledning</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>VV</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#0000B6</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">8 16 16 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Oljeutskiller</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>OIL</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#800000</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">8 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>    
      <sld:Rule><sld:Name>Trykkledning</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>ST</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#0000FF</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
           <sld:CssParameter name="stroke-dasharray">16 16</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
      <sld:Rule><sld:Name>Pumpeledning avl?p</sld:Name> 
          <ogc:Filter> 
         <ogc:And>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>PF</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>Geometri</ogc:PropertyName> 
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#FF0000</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">8</sld:CssParameter> 
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule> 
		<sld:Rule><sld:Name>Kum</sld:Name> 
          <ogc:Filter> 
		  <ogc:And> 
		  <ogc:Or>         
            <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>KUM</ogc:Literal> 
            </ogc:PropertyIsEqualTo> 
			 <ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>VNK</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
			<ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>VATYPE</ogc:PropertyName> 
              <ogc:Literal>SPK</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:Or>        
			<ogc:PropertyIsEqualTo> 
              <ogc:PropertyName>OMRADE_K</ogc:PropertyName> 
              <ogc:Literal>544</ogc:Literal> 
            </ogc:PropertyIsEqualTo>
         </ogc:And> 
          </ogc:Filter> 
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>15000</MaxScaleDenominator>       
       <sld:PointSymbolizer> 
			<sld:Geometry> 
				<ogc:PropertyName>Geometri</ogc:PropertyName> 
			</sld:Geometry> 
            <sld:Graphic> 
              <sld:Mark> 
                <sld:WellKnownName>circle</sld:WellKnownName> 
                <sld:Fill> 
                  <sld:CssParameter name="fill"> 
                    <ogc:Literal>#FFFFFF</ogc:Literal> 
                  </sld:CssParameter> 
                </sld:Fill> 
                <sld:Stroke> 
                  <sld:CssParameter name="stroke"> 
                    <ogc:Literal>#000000</ogc:Literal> 
                  </sld:CssParameter> 
                  <sld:CssParameter name="stroke-width"> 
                    <ogc:Literal>2</ogc:Literal> 
                  </sld:CssParameter> 
                </sld:Stroke> 
              </sld:Mark> 
              <sld:Size> 
                <ogc:Literal>15.0</ogc:Literal> 
              </sld:Size> 
            </sld:Graphic> 
          </sld:PointSymbolizer> 
        </sld:Rule> 
      </sld:FeatureTypeStyle> 
    </sld:UserStyle> 
   </sld:NamedLayer> 
</sld:StyledLayerDescriptor>