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
      <sld:Title>Trasepunkt</sld:Title>
      <sld:Abstract>Presentasjon av VA-Trasepunkt</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault> 
      <sld:FeatureTypeStyle> 
        <sld:Name>Default</sld:Name> 
        <sld:Rule> 
          <sld:Name>Stil for Trasepunkt</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>20000000</MaxScaleDenominator>
            <sld:PointSymbolizer>
              <sld:Geometry>
                <ogc:PropertyName>va:geometri</ogc:PropertyName>
              </sld:Geometry>
              <sld:Graphic>
                <sld:Mark>
                  <sld:WellKnownName>circle</sld:WellKnownName>
                  <sld:Fill>
                    <sld:CssParameter name="fill">
                      <ogc:Literal>#D1D1E0</ogc:Literal>
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
                  <ogc:Literal>10.0</ogc:Literal>
                </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle> 
    </sld:UserStyle> 
   </sld:NamedLayer> 
</sld:StyledLayerDescriptor>