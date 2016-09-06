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
      <sld:Abstract>Punkter for byggesak - Ulike symbol for disp. og rammetillatelse</sld:Abstract>
      <sld:IsDefault>1</sld:IsDefault>
      <sld:FeatureTypeStyle>
        <sld:Name>Default</sld:Name>
        <sld:Rule>
          <sld:Name>Bygg Rammetillatelse - Under behandling</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.RAMME</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Under behandling -->
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>triangle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#0033CC</ogc:Literal>
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
                <ogc:Literal>20</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>		
        <sld:Rule>
          <sld:Name>Bygg Rammetillatelse: Avsluttet</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.RAMME</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsNotEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Avsluttet -->
            </ogc:PropertyIsNotEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>triangle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#24B200</ogc:Literal>	<!-- Gr?nn -->
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
                <ogc:Literal>20</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
        <sld:Rule>
          <sld:Name>Bygg Rammetillatelse M:2000</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.RAMME</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Under behandling -->
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>2001</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>triangle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#0033CC</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>1</ogc:Literal>
                  </sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>15</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Bygg Rammetillatelse: Avsluttet M:2000</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.RAMME</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsNotEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Avsluttet / Avsl?tt -->
            </ogc:PropertyIsNotEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>2001</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>triangle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#24B200</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>1</ogc:Literal>
                  </sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>15</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>

		
		
        <sld:Rule>
          <sld:Name>Stil for Bygg Dispensasjon</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.DISP</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Under behandling -->
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#0033CC</ogc:Literal>
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
                <ogc:Literal>20</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Name>Stil for Bygg Dispensasjon</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.DISP</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsNotEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Avsluttet / Avsl?tt -->
            </ogc:PropertyIsNotEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>2000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#24B200</ogc:Literal>
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
                <ogc:Literal>20</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
		
        <sld:Rule>
          <sld:Name>Bygg Dispensasjon M 2000</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.DISP</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Under behandling -->
            </ogc:PropertyIsEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>2001</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#0033CC</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>1</ogc:Literal>
                  </sld:CssParameter>
                </sld:Stroke>
              </sld:Mark>
              <sld:Size>
                <ogc:Literal>15</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>		
        <sld:Rule>
          <sld:Name>Bygg Dispensasjon</sld:Name>
          <ogc:Filter>
			<ogc:And>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.DISP</ogc:Literal>
            </ogc:PropertyIsEqualTo>
            <ogc:PropertyIsNotEqualTo>
              <ogc:PropertyName>Saksstatuskodeverdi</ogc:PropertyName>
              <ogc:Literal>B</ogc:Literal>	<!-- Avsluttet / Avsl?tt -->
            </ogc:PropertyIsNotEqualTo>
			</ogc:And>
          </ogc:Filter>
          <MinScaleDenominator>2001</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#24B200</ogc:Literal>
                  </sld:CssParameter>
                </sld:Fill>
                <sld:Stroke>
                  <sld:CssParameter name="stroke">
                    <ogc:Literal>#000000</ogc:Literal>
                  </sld:CssParameter>
                  <sld:CssParameter name="stroke-width">
                    <ogc:Literal>1</ogc:Literal>
                  </sld:CssParameter>
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
	
	
    <sld:Name>Outline</sld:Name>
    <sld:UserStyle xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">
      <sld:Name/>
      <sld:Title>tor</sld:Title>
      <sld:Abstract>Filled cirkle with outline</sld:Abstract>
      <sld:FeatureTypeStyle>
        <sld:Name>Outline</sld:Name>
        <sld:Rule>
          <sld:Name>Byggesak markering</sld:Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.RAMME</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>triangle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#E60066</ogc:Literal>
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
                <ogc:Literal>24</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
         <sld:Rule>
          <sld:Name>Stil for Bygg Dispensasjon</sld:Name>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>Mappetypekodeverdi</ogc:PropertyName>
              <ogc:Literal>BYG.DISP</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <MinScaleDenominator>1</MinScaleDenominator>
          <MaxScaleDenominator>20000</MaxScaleDenominator>
          <sld:PointSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>Geometry</ogc:PropertyName>
            </sld:Geometry>
            <sld:Graphic>
              <sld:Mark>
                <sld:WellKnownName>circle</sld:WellKnownName>
                <sld:Fill>
                  <sld:CssParameter name="fill">
                    <ogc:Literal>#E60066</ogc:Literal>
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
                <ogc:Literal>24</ogc:Literal>
              </sld:Size>
            </sld:Graphic>
          </sld:PointSymbolizer>
        </sld:Rule>
       </sld:FeatureTypeStyle>
    </sld:UserStyle>
   </sld:NamedLayer>
</sld:StyledLayerDescriptor>