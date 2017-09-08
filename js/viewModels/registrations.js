define(['ojs/ojcore', 'knockout', 'jquery'], function (oj, ko, $) {

    // default field values
    var defaultValues = {
        time: "",
        email: "",
        zipCode: "",
        school: "",
        location: "",
        guardian: "",
        status: 0,
        consentUrl: ""
    }

    // Registration model
    function Registration(time, email, zipCode, school, location, guardian, status, consentUrl) {
        this.time = time || defaultValues.time;
        this.email = email || defaultValues.email;
        this.zipCode = zipCode || defaultValues.zipCode;
        this.school = school || defaultValues.school;
        this.location = location || defaultValues.location;
        this.guardian = guardian || defaultValues.guardian;
        this.status = status || defaultValues.status;
        this.consentUrl = consentUrl || defaultValues.consentUrl;
    }

    // this function formats a location to: zapopan, jal, MX
    function formatLocation(registration) {
        var city = registration.attributes.FromCity || "";
        var state = registration.attributes.FromState || "";
        var country = registration.attributes.FromCountry || "";

        return city.toLowerCase() + ", " + state.toLowerCase().replace(".",'') + ", " + country;
    }

    // extract Registrations information from fetched JSON and push it to an ObservableArray
    function parseRegistrations(json) {

        var tmpArray = [];

        json.results.map((registration) => {

            var time = moment(registration.parameters.date).format("MM/DD/YYYY"); //format the date
            var email = registration.parameters.girl.email;
            var zipCode = registration.attributes.FromZip;
            var school = registration.parameters.school;
            var location = formatLocation(registration); //format the location
            var guardian = registration.parameters.guardian.email;
            var status = registration.isConsentSent; //isConsentSent is a boolean
            var consentUrl = registration.consentForm; //consent form photo

            // add new Registration into a temporal array
            tmpArray.push(new Registration(time, email, zipCode, school, location, guardian, status, consentUrl));
        });

        // after the temp array is built, then push it into the observable array just once, so it triggers rendering
        registrations(tmpArray);
    }

    // fetch the JSON from the API endpoint and pass the results to parseRegistrations
    function fetchData() {
        $.getJSON("http://pat.theiotlabs.com:1919/parse/classes/Registration", parseRegistrations);
    }

    // columns displayed on the table
    var columns = [{
            display: "submit date",
            sortable: false
        },
        {
            display: "email",
            sortable: true
        },
        {
            display: "zip code",
            sortable: true
        },
        {
            display: "school",
            sortable: true
        },
        {
            display: "location",
            sortable: true
        },
        {
            display: "guardian",
            sortable: true
        },
        {
            display: "status",
            sortable: true
        }
    ];

    // registrations is the observableArray which will be rendered onto the table
    var registrations = ko.observableArray([]);

    // fetchData at module boot up
    fetchData();

    return {
        columns: columns,
        registrations: registrations
    }

});