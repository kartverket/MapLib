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
      <sld:Title>NoIS - tor: NPD Quadrant</sld:Title>
      <sld:Abstract>SAM-X: SLD for quadrant</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>Quadrant</sld:Name>
        <sld:Rule>
          <sld:Name>Quadrant</sld:Name>
          <MinScaleDenominator>100000</MinScaleDenominator>
          <MaxScaleDenominator>20000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">1</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Label</sld:Name>
          <MinScaleDenominator>100000</MinScaleDenominator>
          <MaxScaleDenominator>5000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e2e2e2</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.01</sld:CssParameter>
			</sld:Fill>									
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#000000</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			</sld:Stroke>			
			<Label>
				<ogc:PropertyName>LABEL</ogc:PropertyName>
			</Label>			
		  </sld:PolygonSymbolizer>
        </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>NoIS - tor: NPD Qudrant</sld:Title>
      <sld:Abstract>Outline - Presentasjon av kvadranter</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline</sld:Name>
        <sld:Rule>
          <sld:Name>Quadrant</sld:Name>
          <MinScaleDenominator>100000</MinScaleDenominator>
          <MaxScaleDenominator>20000000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometry</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#e2e2e2</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.1</sld:CssParameter>
			</sld:Fill>												
			<sld:Stroke>
              <sld:CssParameter name="stroke">
                <ogc:Literal>#ef0909</ogc:Literal>
              </sld:CssParameter>
			  <sld:CssParameter name="stroke-width">4</sld:CssParameter>
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
 		</sld:FeatureTypeStyle>
    </sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>