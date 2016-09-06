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
      <sld:Abstract>Presentasjon av PblTiltak</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>Tiltak</sld:Name>
        <sld:Rule>
          <sld:Name>Godkjente tiltak</sld:Name>
          <ogc:Filter>
	   <ogc:And>		  
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>KARTREG</ogc:PropertyName>
              <ogc:Literal>1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	        <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>VEDTAK</ogc:PropertyName>
              <ogc:Literal>1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	 </ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator> <!-- Makes no sence to use a smaller scale than 10000 for point symbols -->
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#FF3333</ogc:Literal>
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
                <ogc:Literal>14.0</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
		<sld:Rule>
          <sld:Name>Utforte tiltak</sld:Name>
          <ogc:Filter>
          <ogc:And>		  
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>KARTREG</ogc:PropertyName>
              <ogc:Literal>2</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	     </ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator> <!-- Makes no sence to use a smaller scale than 10000 for point symbols -->
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#339900</ogc:Literal>
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
                <ogc:Literal>14.0</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
		
<!-- X -->
<!-- Tegneregel for flate -->
		<sld:Rule>
          <sld:Name>Stil for flate - kartreg1</sld:Name>
          <ogc:Filter>
		  	<ogc:And>
              <ogc:Or>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
 
		  </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#7710FF</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.35</sld:CssParameter>
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
          <sld:Name>Stil for flate - kartreg2</sld:Name>
         <ogc:Filter>
		   <ogc:And>
              <ogc:Or>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
                <ogc:PropertyIsGreaterThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsGreaterThan>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
         </ogc:Filter>
		  <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#339900</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.35</sld:CssParameter>
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
          <sld:Name>Stil for flate - revet</sld:Name>
        <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                <ogc:Literal>39</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>KARTREG</ogc:PropertyName>
                  <ogc:Literal>1</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>KARTREG</ogc:PropertyName>
                  <ogc:Literal>2</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
            </ogc:And>
          </ogc:Filter>
		  <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#133900</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.35</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">1</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		
		
       
<!-- Tegneregel for Linje -->


	   <sld:Rule>
          <sld:Name>Stil for linje kartreg1</sld:Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:Or>
                <ogc:Or>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>60</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>61</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                </ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>62</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
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
                <ogc:Literal>#CC0099</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">4</sld:CssParameter>
			  <sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter>
			</sld:Stroke>
		  </sld:LineSymbolizer>
        </sld:Rule>	
		
		 <sld:Rule>
          <sld:Name>Stil for linje kartreg2 </sld:Name>
         <ogc:Filter>
            <ogc:And>
              <ogc:Or>
                <ogc:Or>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>60</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>61</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                </ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>62</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>2</ogc:Literal>
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
                <ogc:Literal>#339900</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">4</sld:CssParameter>
			  <sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter>
			</sld:Stroke>
		  </sld:LineSymbolizer>
        </sld:Rule>	
		
		
		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>tor_markering</sld:Title>
      <sld:Abstract>Presentasjon av PblTiltak - outline</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline</sld:Name>
        <sld:Rule>
          <sld:Name>Stil for punkt 1</sld:Name>
          <ogc:Filter>
	   <ogc:And>		  
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>KARTREG</ogc:PropertyName>
              <ogc:Literal>1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	        <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>VEDTAK</ogc:PropertyName>
              <ogc:Literal>1</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	    </ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#8088FF</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>3</ogc:Literal>
                  </sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>14.0</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
        
		<sld:Rule>
          <sld:Name>Stil for punkt 2</sld:Name>
          <ogc:Filter>
	   <ogc:And>		  
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>KARTREG</ogc:PropertyName>
              <ogc:Literal>2</ogc:Literal>
            </ogc:PropertyIsEqualTo>
	      </ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#8088FF</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>3</ogc:Literal>
                  </sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>24.0</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
		
		
		<sld:Rule>
		<sld:Name>Stil for flate1</sld:Name>
       <ogc:Filter>
		<ogc:And>
              <ogc:Or>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#0066B3</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.7</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">3</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		
		<sld:Rule>
		<sld:Name>Stil for flate2</sld:Name>
       <ogc:Filter>
            <ogc:And>
              <ogc:Or>
                <ogc:PropertyIsLessThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsLessThan>
                <ogc:PropertyIsGreaterThan>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>39</ogc:Literal>
                </ogc:PropertyIsGreaterThan>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>2</ogc:Literal>
              </ogc:PropertyIsEqualTo>
            </ogc:And>
          </ogc:Filter>

          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#0066B3</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.7</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">3</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		
			<sld:Rule>
		<sld:Name>Stil for revet</sld:Name>
       <ogc:Filter>
            <ogc:And>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                <ogc:Literal>39</ogc:Literal>
              </ogc:PropertyIsEqualTo>
              <ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>KARTREG</ogc:PropertyName>
                  <ogc:Literal>1</ogc:Literal>
                </ogc:PropertyIsEqualTo>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>KARTREG</ogc:PropertyName>
                  <ogc:Literal>2</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
            </ogc:And>
          </ogc:Filter>

          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>15000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#0066B3</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.7</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">3</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		
		
        <sld:Rule>
          <sld:Name>Stil for linje 1</sld:Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:Or>
                <ogc:Or>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>60</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>61</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                </ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>62</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>1</ogc:Literal>
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
                <ogc:Literal>#0066B3</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">4</sld:CssParameter>
			  <!--sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter-->
			</sld:Stroke>
		  </sld:LineSymbolizer>
        </sld:Rule>	
		
		<sld:Rule>
          <sld:Name>Stil for linje 2</sld:Name>
          <ogc:Filter>
            <ogc:And>
              <ogc:Or>
                <ogc:Or>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>60</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                  <ogc:PropertyIsEqualTo>
                    <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                    <ogc:Literal>61</ogc:Literal>
                  </ogc:PropertyIsEqualTo>
                </ogc:Or>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PBTILTAK</ogc:PropertyName>
                  <ogc:Literal>62</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              </ogc:Or>
              <ogc:PropertyIsEqualTo>
                <ogc:PropertyName>KARTREG</ogc:PropertyName>
                <ogc:Literal>2</ogc:Literal>
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
                <ogc:Literal>#0066B3</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">4</sld:CssParameter>
			  <!--sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter-->
			</sld:Stroke>
		  </sld:LineSymbolizer>
        </sld:Rule>
		
	</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>