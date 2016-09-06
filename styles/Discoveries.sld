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
      <sld:Title>NoIS - tor: Area for oil and gas discoveries</sld:Title>
      <sld:Abstract>SLD - Oil or Gas discovery fields, dscArea</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>dscArea Discovery</sld:Name>
        <sld:Rule>
          <sld:Name>Oil discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>OIL</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#007740</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			</sld:Fill>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Gas discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>GAS</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e52730</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			</sld:Fill>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Oil Gas discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>OIL/GAS</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
				<ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e2de9e</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			  <sld:GraphicFill>
				<sld:Graphic>
				  <sld:Mark>
					<sld:WellKnownName>shape://slash</sld:WellKnownName>
					<sld:Stroke>
					  <sld:CssParameter name="stroke">#007740</sld:CssParameter>
					</sld:Stroke>
				  </sld:Mark>
				</sld:Graphic>
			  </sld:GraphicFill>
			</sld:Fill>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Gas Condensate discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>GAS/CONDENSATE</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
				<ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#3c30ba</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			  <sld:GraphicFill>
				<sld:Graphic>
				  <sld:Mark>
					<sld:WellKnownName>shape://slash</sld:WellKnownName>
					<sld:Stroke>
					  <sld:CssParameter name="stroke">#7e286f</sld:CssParameter>
					</sld:Stroke>
				  </sld:Mark>
				</sld:Graphic>
			  </sld:GraphicFill>
			</sld:Fill>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>NoIS - tor: SLD style for outline</sld:Title>
      <sld:Abstract>Oil and gas fields</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline for fields</sld:Name>
        <sld:Rule>
          <sld:Name>Oil discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>OIL</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#007740</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#ba4a4a</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>			  
			</sld:Stroke>	
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Gas discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>GAS</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e52730</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#ba4a4a</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>			  
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Oil Gas discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>OIL/GAS</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
				<ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e2de9e</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#ba4a4a</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>			  
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Gas Condensate discovery</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>DSC_HCTYPE</ogc:PropertyName>
              <ogc:Literal>GAS/CONDENSATE</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>3000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
				<ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#252068</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
              <sld:CssParameter name="stroke">#ffffff</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>