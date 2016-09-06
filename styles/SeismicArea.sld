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
      <sld:Title>NoIS - tor: SAMX Seismic area</sld:Title>
      <sld:Abstract>SLD definitions for area</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>SeismicArea</sld:Name>
        <sld:Rule>
          <sld:Name>Seismic_incl_turn</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PolygonTypeC</ogc:PropertyName>
              <ogc:Literal>Area_inclusive_turn</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>								
			<sld:Fill>
			  <sld:CssParameter name="fill">#e4e827</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.15</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">#e4e827</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">1</sld:CssParameter>
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Seismic_excl_turn</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PolygonTypeC</ogc:PropertyName>
              <ogc:Literal>Area_exclusive_turn</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>								
			<sld:Fill>
			  <sld:CssParameter name="fill">#5e5e5e</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.15</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">#5e5e5e</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">1</sld:CssParameter>
			</sld:Stroke>			
 		  </sld:PolygonSymbolizer>
       </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>NoIS - tor: Country</sld:Title>
      <sld:Abstract>SLD definitions for area</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>SeismicArea</sld:Name>
        <sld:Rule>
          <sld:Name>Seismic_incl_turn</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PolygonTypeC</ogc:PropertyName>
              <ogc:Literal>Area_inclusive_turn</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>								
			<sld:Fill>
			  <sld:CssParameter name="fill">#e4e827</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">#e4e827</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Seismic_excl_turn</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PolygonTypeC</ogc:PropertyName>
              <ogc:Literal>Area_exclusive_turn</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>								
			<sld:Fill>
			  <sld:CssParameter name="fill">#5e5e5e</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.4</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">#5e5e5e</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			</sld:Stroke>			
 		  </sld:PolygonSymbolizer>
        </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>