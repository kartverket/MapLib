<sld:StyledLayerDescriptor version="1.0.0"
    xmlns:sld="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:gml="http://www.opengis.net/gml"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.opengis.net/sld http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
  <sld:NamedLayer>
    <sld:Name>Wells</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>SAM-X wells</sld:Title>
      <sld:Abstract>NoIS tor: SAM-X style for wlb-point</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>wellborePoint</sld:Name>
        <sld:Rule>
          <sld:Name>Wellbore</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000000</MaxScaleDenominator>
          <ogc:Filter>
			<ogc:Or>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PURPOSE</ogc:PropertyName>
              <ogc:Literal>APPRAISAL</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>PURPOSE</ogc:PropertyName>
              <ogc:Literal>WILDCAT</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:Or>
          </ogc:Filter>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
				<sld:Fill>
				  <sld:CssParameter name="fill">#fffffa</sld:CssParameter>
				  <sld:CssParameter name="fill-opacity">0.1</sld:CssParameter>
				</sld:Fill>										
			  </sld:Mark>
 				<sld:ExternalGraphic> 
					<OnlineResource xlink:href="http://geoinnsyn.nois.no/well.png" />
					<Format>image/png</Format> 
				</sld:ExternalGraphic>			  
              <sld:Size>
                <ogc:Literal>12</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
        <sld:Rule>
          <sld:Name>Wellbore_Shallow</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000000</MaxScaleDenominator>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>WELL_TYPE</ogc:PropertyName>
              <ogc:Literal>SHALLOW</ogc:Literal>
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
				<sld:Fill>
				  <sld:CssParameter name="fill">#fffffa</sld:CssParameter>
				  <sld:CssParameter name="fill-opacity">0.1</sld:CssParameter>
				</sld:Fill>										
              </sld:Mark>
 				<sld:ExternalGraphic> 
					<OnlineResource xlink:href="http://geoinnsyn.nois.no/well_shallow.png" /> 
					<Format>image/png</Format> 
				</sld:ExternalGraphic>			  			  
              <sld:Size>
                <ogc:Literal>12</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>		
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
	
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>SAM-X x highlight</sld:Title>
      <sld:Abstract>NoIS tor: SAM-X style for wlb-point</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>wellborePoint</sld:Name>
        <sld:Rule>
          <sld:Name>wellbore</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">#777777</sld:CssParameter>
				   <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
                </sld:Fill>				
                <sld:Stroke>
                  <sld:CssParameter name="stroke">#ff0000</sld:CssParameter>
				  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>15</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
	  </sld:FeatureTypeStyle>			
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>