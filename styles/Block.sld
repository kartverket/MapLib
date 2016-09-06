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
      <sld:Title>NoIS - tor: NPD Blocks</sld:Title>
      <sld:Abstract>SLD definitions for blocks</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>Default</sld:Name>
        <sld:Rule>
          <sld:Name>Block</sld:Name>
          <MinScaleDenominator>100000</MinScaleDenominator>
          <MaxScaleDenominator>1000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>								
			<sld:Fill>
			  <sld:CssParameter name="fill">#fffffd</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.05</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#0029c1</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">1</sld:CssParameter>
			</sld:Stroke>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>NoIS - tor: NPD Blocks</sld:Title>
      <sld:Abstract>Outline SLD definitions for blocks</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline</sld:Name>
        <sld:Rule>
          <sld:Name>Block</sld:Name>
          <MinScaleDenominator>100000</MinScaleDenominator>
          <MaxScaleDenominator>1000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#cecece</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.2</sld:CssParameter>
			</sld:Fill>						
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#ef0909</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2.5</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>