/*
This class is for misc. functions that don't fit anywhere else.
*/
var Util = (function (scope) {
	function Util(){

	}
	Util.prototype.RenderPoints = function(pointsArray){
		/*
			Given an array of 3D points, return an object holding them, ready to be
			added to a scene
		 */
		var pointsGeometry = new THREE.Geometry();

		for ( var i = 0; i < pointsArray.length; i ++ ) {
			pointsGeometry.vertices.push( pointsArray[i] );
		}

		var material = new THREE.PointsMaterial( { color:0xff0000, size:10, sizeAttenuation:false } );
		var mesh = new THREE.Points( pointsGeometry, material );

		return mesh;
	}
	Util.prototype.ParseConvexPoints = function(string){
		/*
			Takes in a string a points, and returns an array of points.
			Turns "(1,1),(2,2),(3,3)" 			  -> [{x:1,y:1},{x:2,y:2},{x:3,y:3}]
			and	  "(1,1,1),(2,2,2),(3,3,3)" 	  -> [{x:1,y:1,z:1},{x:2,y:2,z:2},{x:3,y:3,z:3}]
			and	  "(1,1,1,1),(2,2,2,2),(3,3,3,3)" -> [{x:1,y:1,z:1,w:1},{x:2,y:2,z:2,w:2},{x:3,y:3,z:3,w:3}]
				Input:
					A string formatted as "(Number,Number)" | "(Number,Number,Number)" | "(Number,Number,Number,Number)"
				Output:
					[{x:Number,y:Number}] including z and w for up to 4 numbers.
		*/

		// Remove whitespace
		var points_str = string.replace(/\s+/g, '');
		// Split based on the regex pattern. Should match all of the following:
		//				 (1,2), (3,4),(4,3,32), (-3,4,67.5,3), (4,-4.6,5,332,3)
		var points_split = points_str.match(/\((-*[.\d]+,)+-*[.\d]+\)/g);
		var pointsArray = [];

		if(points_split == null){
			console.error("Convex Hull Parsing Error:","Failed to parse points. Malformed input.");
			return pointsArray;
		}

		for(var i=0;i<points_split.length;i++){
			var p = points_split[i];
			// Remove parenthesis
			p = p.replace(/[\(\)]/g,'');
			// Split by comma
			var comma_split = p.split(",")
			var point = {};
			var map = ['x','y','z','w'];
			for(var j=0;j<comma_split.length;j++){
				if(j >= 4){
					console.error("Convex Hull Parsing Error:","Detected points with more than 4 coordinates. Ignoring extra coordinates.");
					break;
				}
				if(Number(comma_split[j]) == undefined){
					console.error("Convex Hull Parsing Error:","Found undefined number. Returning empty array.");
					return [];
				}
				point[map[j]] = Number(comma_split[j]);

			}
			pointsArray.push(point)
		}

		return pointsArray;
	}
	Util.prototype.CleanUpScene = function(scene) {
		/*
			Given an three.js scene, remove all of the
			objects (the children) in the scene
		 */
		while (scene.children.length) {

				var obj = scene.children[0];

				if (obj.isMesh || obj.isLine) {
					obj.geometry.dispose();
					obj.material.dispose();
				} else if (obj.isSprite) {
					obj.material.dispose();
				} else if (obj.isLight) {
					// lights only need to be removed
				}
				else {
					console.log("unidentified object of type " + obj.type + " was not destroyed")
					console.log(obj);
				}
		    scene.remove(obj);
		}
	}

	scope.Util = Util;
	return Util;
})(typeof exports === 'undefined' ? {} : exports);
