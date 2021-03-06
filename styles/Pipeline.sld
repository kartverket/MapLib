<sld:StyledLayerDescriptor version="1.0.0"
    xmlns:sld="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <sld:NamedLayer>
    <sld:Name>Pipeline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>SAM-X Pipeline</sld:Title>
      <sld:Abstract>NoIS tor: SAM-X style for pipelines</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>pipeline</sld:Name>
        <sld:Rule>
          <sld:Name>Pipeline</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000000</MaxScaleDenominator>
          <sld:LineSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#ff8000</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>			  
			</sld:Stroke>
			
          </sld:LineSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>SAM-X Pipeline Outline</sld:Title>
      <sld:Abstract>NoIS tor: SAM-X style for pipelines</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>pipeline</sld:Name>
        <sld:Rule>
          <sld:Name>Pipeline</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000000</MaxScaleDenominator>
          <sld:LineSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#ba8b3b</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">3</sld:CssParameter>			  
			</sld:Stroke>
			
          </sld:LineSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>