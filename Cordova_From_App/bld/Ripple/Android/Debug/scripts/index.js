// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.


        // --- Data model for Page 

        function Page( input ) {
            var dat = this;
            
            dat.Name    = input.name;
            dat.Number  = input.number;
            dat.Fields  = input.fields;  

            dat.Validate = function () {

                if (dat.Fields == null) {
                    console.log("Page has no fields to validate!")
                    return true;
                }

                var pageValid = true;
                for (item in dat.constructor) {
                    console.log(item.isValid());
                    pageValid = !item.isValid() ? false : pageValid;
                }
                console.log("pageValid : " + pageValid);
                return pageValid;
            }

        }





        // --- Data model for Pages

        function Pages() {
            var dis = this;
            dis.PageArray = null; 
            dis.CurrentPage = ko.observable();


            dis.PageTransition = function (from, to) {

                // annimate - hide from , show to
                console.log("Pages.CurrentPage.Name : " + dis.CurrentPage.Name);
                console.log("Page was        : " + from.Name);
                console.log("Setting page to : " + to.Name);

                dis.CurrentPage(to);

            }
            
            dis.GoToPage = function( Page ){
                //pageName e.g. "Home"
                //search array by name
                //for()

                //console.log("----- Page ------");
                //console.log(Page.Name);
                /*
                if (dis.CurrentPage == Page) {
                    console.log("Pages are same - Don't do owt!");
                    return null;
                }
                else {
                    console.log("Pages are differnt go to next stage!");
                    console.log("Page diff from current page : " + dis.CurrentPage.Name);
                }
                */
                dis.PageTransition(dis.CurrentPage, Page);

            }

            dis.Next = function (Page) {

                /*
                if (dis.CurrentPage.Validate()) {
                    //valid, therefore set CurrentPage to next in array 
                    //NB simple routing could be replaced
                    //dis.CurrentPage = dis.PageArray[dis.CurrentPage.Number + 1];
                    //??????? - dis.PageTransition(from, to);
                }
                else {
                    // TODO: show message &/or sort out Knockout validation
                }
                */

            }

            
        }




        // --- Data model for form data
        
        function FormData() {

            var that = this;

            that.titles = [
                { "caption": "Mr", "value": "Mr" },
                { "caption": "Mrs", "value": "Mrs" },
                { "caption": "Miss", "value": "Miss" },
                { "caption": "Ms", "value": "Ms" }
            ];

            that.Title      = ko.observable();
            that.FirstName  = ko.observable().extend({ required: true });
            that.LastName   = ko.observable().extend({ required: true });


            var today = new Date();
            var hh = today.getHours();
            var mm = today.getMinutes();
            var ss = today.getSeconds();

            var dd = today.getDate();
            var MM = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            that.currentHour = ko.observable(hh);
            that.currentMin = ko.observable(mm);
            that.currentSec = ko.observable(ss);

            that.CurrentTime = ko.computed(function () {
                return dateTimeConcat(that.currentHour(), that.currentMin(), that.currentSec(), ":");
            });
            

            that.currentDay = ko.observable(dd);
            that.currentMonth = ko.observable(MM);
            that.currentYear = ko.observable(yyyy);
            that.CurrentDate = ko.computed(function () {
                return dateTimeConcat(that.currentDay(), that.currentMonth(), that.currentYear(), "/");
            });


            that.hours = generateSelectArray({ size: 24, startNo: 0 });            
            that.mins = generateSelectArray({ size: 60, startNo: 0 });
            that.secs = generateSelectArray({ size: 60, startNo: 0 });

            that.days = generateSelectArray({ size: 31, startNo: 1 });
            that.months = generateSelectArray({ size: 12, startNo: 1 });
            that.years = generateSelectArray({ size: 116, startNo: 1900 });
            

            that.day = ko.observable(1);
            that.month = ko.observable(1);
            that.year = ko.observable(1990);
            that.DOB = ko.computed(function () {
                return dateTimeConcat(that.day(), that.month(), that.year(), "/");
            }).extend({ requied: true }); //dateISO: true 


            

            // --- Navigation ---

            //user starts on Home page
                //click 'continue'
                //slides to 'Who' page
                //updates that.CurrentPage    

            //clicks on continue
                //checks form validation
                //form is invlaid 
                //shows messages

            //user fills in all fields correctly
              
            /*
            Pages.goToPage("Home");
            Pages.Next();
            
            Pages.Current;

            Pages.Page[1];
            Page.Validate();


            Page({ "name": "Home", "number": 0, array of fields  );

            var Pages = {
                "Home":     { number: 0, valid: true },
                "Who":      { number: 1, valid: false },
                "Where":    { number: 2, valid: false },
                "When":     { number: 3, valid: false },
                "Review":   { number: 4, valid: false },
                "Submit:":  { number: 5, valid: false }
            };

            that.CurrentPage = Pages.Who;
            


            that.Page_1_valid = ko.computed(function () {
                var pageValid = that.Title.isValid() &&
                                that.FirstName.isValid() &&
                                that.LastName.isValid() &&
                                that.DOB.isValid();
                return pageValid;
            });
            */

            that.Pages = new Pages();

            //Fields to validate
            var WhoFields = [ that.FirstName, that.LastName, that.DOB ];
            var WhenFields = [ that.CurrentDate ];

            that.Pages.PageArray = [
                new Page({ "name": "Home",  "number": 0, "fields": null }),
                new Page({ "name": "Who",   "number": 1, "fields": WhoFields }),
                new Page({ "name": "Where", "number": 2, "fields": null }),
                new Page({ "name": "When",  "number": 3, "fields": WhenFields }),
                new Page({ "name": "Review", "number": 4, "fields": null }),
                new Page({ "name": "Submit", "number": 5, "fields": null })
            ];

            //set the current page as the Home page [0] in array
            that.Pages.CurrentPage(that.Pages.PageArray[0]);
            
            console.log(that.Pages);
            // --- Location / Google Maps ---

            //Coord enum - with default location
            var Coords = {
                "lat": 51.508742,
                "lon": -0.120850
            }

            that.Location = Coords;
            that.MapButton = ko.observable("Incorrect Location, I will select");
            that.MapMarker = undefined;
            that.googleMap;
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
            //navigator.geolocation.getCurrentPosition(geolocationFailure);

            function geolocationFailure() {
                that.ChangeLocation();
            }


            function geolocationSuccess(position) {
                that.Location.lat = position.coords.latitude;
                that.Location.lon = position.coords.longitude;
                that.createMap();
            }

            that.ChangeLocation = function () {
                var mbVal = that.MapButton();
                if (mbVal == "Select this location") {
                    var centre = that.googleMap.getCenter();
                    that.Location.lat = centre.k;
                    that.Location.lon = centre.D;
                    that.createMap();
                }
                else {
                    that.MapButton("Select this location");
                    that.createMap();
                }
            }

            that.createMap = function(){
                var myCenter = new google.maps.LatLng(that.Location.lat, that.Location.lon);

                var mapProp = {
                    center: myCenter,
                    zoom: 5,
                    panControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                //dont recreate map if already exists 
                if (that.googleMap == undefined || that.googleMap == null) {
                    that.googleMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
                }
                

                if (that.MapMarker == undefined) {
                    that.MapMarker = new google.maps.Marker({
                        position: myCenter,
                        animation: google.maps.Animation.DROP,
                        draggable: true
                    });
                }
                else {
                    that.MapMarker.animation = google.maps.Animation.DROP;
                    that.MapMarker.position = myCenter;
                }

                that.MapMarker.setMap(that.googleMap);

            }


            that.submit = function () {
                console.log(that.Title.isValid());
                //console.log("DOB valid : " + that.DOB.isValid());
                console.log(ko.validation.group(that));
            }

            function dateTimeConcat(arg1 ,arg2 , arg3, div ) {
                var out = "";
                out += arg1 + div;
                out += arg2 + div;  
                out += arg3
                return out;
            }


            function generateSelectArray(options) {
                var array = [];
                for (var i = 0; i < options.size; i++) {
                    var str = i + options.startNo;
                    array[i] = { "number": str, "value": str };
                }
                return array;
            };


        }
        


        // --- View model for form

        function FormViewModel() {
            var self = this;
            self.FormData = new FormData();

        }


        // --- knockout validation config

        ko.validation.init({
            registerExtenders: true,
            messagesOnModified: true,
            insertMessages: false
        });

        ko.applyBindings(new FormViewModel());

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };




})();




