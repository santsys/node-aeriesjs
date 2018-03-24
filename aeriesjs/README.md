# aeriesjs
An Aeries SIS (www.aeries.com) API helper library. Helping simplify using the Aeries API with Node applications.

More information on the API can be found here, https://support.aeries.com/support/solutions/articles/14000077926-aeries-api-full-documentation.

## Requirements

* NodeJS 8+ (https://nodejs.org/en/download/)
* Access to an Aeries SIS API (http://www.aeries.com/)

# Example Usage

#### Get a list of schools
```js
let api = require('aeriesjs');

var aeries = new api({
    certificate: '477abe9e7d27439681d62f4e0de1f5e1',
    url: 'https://demo.aeries.net/aeries/',
});

console.log('Getting list of schools: ');

aeries.getSchools(function (error, body, code) {
    if (error) {
        console.log('\t', error);
    }
    else {
        for (var i in body) {
            var s = body[i];
            if (s) {
                console.log('\t', s.SchoolCode, ' - ', s.Name);
            }
        }
    }
});
```

**Output**

```cmd
Getting list of schools:
         0  -  Eagle Unified School District
         100  -  ZZZ Basic Code Tables
         200  -  ZZZ Basic Data HS ADS SOC Etc
         990  -  Golden Eagle Elementary School
         991  -  Tawny Eagle YR Elementary School
         992  -  Hawk Elementary for ATT
         993  -  Bald Eagle Intermediate School
         994  -  Screaming Eagle High School
         995  -  Aeries Continuation School
         996  -  Eagle Flight School
         997  -  Eagle Alternative Education School
         998  -  Eagle Summer School
         999  -  ZZZ Inactive Students
```
