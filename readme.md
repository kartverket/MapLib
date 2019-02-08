ISY maplib
====================

Fetching the code
----------------
	1. Install nodejs, make sure you can run the commands "node" in your preferred command line
	2. add "maplib": "https://github.com/kartverket/MapLib.git" to your package.json dependencies and run "npm i"

Contributing
------------
    1. Install nodejs and npm
    2. Install grunt    
    3. Cloen the git-repository "https://github.com/kartverket/MapLib.git"
    4. Run "npm install" on the command line from within the fetched directory
    6. Build and run unit tests with "grunt build"

Architecture
------------

The maplib library is split in two functional parts, ISY.MapAPI and ISY.MapImplementaion.

The public API used by a consumer is known as the MapAPI, and all classes in this part of the architecture uses the namespace ISY.MapAPI.
All logic regarding map functionality is, as far as it is possible, in this part of maplib. Such as handling layers and their sublayers,
what order they are shown in etc., parsing feature responses and creating and activating tools.

All map functionality is handled inside the ISY.MapImplementaion namespace. That is, all objects coming from an external map library is
kept within this domain. This is to ensure that the logic of maplib (ISY.MapAPI) is not polluted with map-implementation specific logic.
This way the logic inside MapAPI is kept focused on the task of handling the map functionality. Likewise, the ISY.Layer-object is not sent
to the MapImplementations, since it only deals with the logic of the map (handling showing of sublayers depending on for example zoom-
levels), instead the ISY.SubLayer-objects are processed in the MapImplementations, where Map-specific objects for each sublayer is created,
stored and processed.
