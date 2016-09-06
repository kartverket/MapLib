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
      <sld:Title>Vannledning</sld:Title>
      <sld:Abstract>Presentasjon av VA-Vannledning</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault> 
      <sld:FeatureTypeStyle> 
        <sld:Name>Default</sld:Name> 
        <sld:Rule> 
          <sld:Name>Stil for Vannledning</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator> 
          <MaxScaleDenominator>20000000</MaxScaleDenominator>
        <sld:LineSymbolizer> 
         <sld:Geometry> 
           <ogc:PropertyName>va:geometri</ogc:PropertyName>
         </sld:Geometry> 
         <sld:Stroke> 
              <sld:CssParameter name="stroke"> 
                <ogc:Literal>#3333FF</ogc:Literal> 
              </sld:CssParameter> 
           <sld:CssParameter name="stroke-width">2</sld:CssParameter>
         </sld:Stroke> 
        </sld:LineSymbolizer> 
        </sld:Rule>
      </sld:FeatureTypeStyle> 
    </sld:UserStyle> 
   </sld:NamedLayer> 
</sld:StyledLayerDescriptor>