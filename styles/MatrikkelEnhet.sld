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
      <sld:Title>Matrikkelenhet SLD</sld:Title>
      <sld:Abstract>Tor: Polygon for presentasjon av matrikkelenhet</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>Default</sld:Name>
        <sld:Rule>
          <sld:Name>Matrikkelenhet</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
		           <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#dbdbdb</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.2</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#E60066</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			  <!--sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter-->
			</sld:Stroke>
		  </sld:PolygonSymbolizer>
        </sld:Rule>
	  </sld:FeatureTypeStyle>
    </sld:UserStyle>

	<sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>tor_markering</sld:Title>
      <sld:Abstract>Presentasjon av matrikkelenhet for markering ved outline</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline</sld:Name>
        <sld:Rule>
          <sld:Name>Matrikkelenhet outline</sld:Name>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>10000</MaxScaleDenominator>
		   <sld:PolygonSymbolizer>
			<sld:Geometry>
			  <ogc:PropertyName>Geometri</ogc:PropertyName>
			</sld:Geometry>
			<sld:Fill>
			  <sld:CssParameter name="fill">#1688e0</sld:CssParameter>
			  <sld:CssParameter name="fill-opacity">0.6</sld:CssParameter>
			</sld:Fill>
			<sld:Stroke>
			  <sld:CssParameter name="stroke">#0033CC</sld:CssParameter>
			  <sld:CssParameter name="stroke-width">2</sld:CssParameter>
			  <!-- sld:CssParameter name="stroke-dasharray">4 10 10 10</sld:CssParameter -->
			</sld:Stroke>
			</sld:PolygonSymbolizer>
		</sld:Rule>
	  </sld:FeatureTypeStyle>
	</sld:UserStyle>
	
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>