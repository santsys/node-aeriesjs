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

```
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

#### Get information about a Course
```js
let api = require('aeriesjs');

var aeries = new api({
    certificate: '477abe9e7d27439681d62f4e0de1f5e1',
    url: 'https://demo.aeries.net/aeries/',
});

console.log('Get Information for course #0618:');
aeries.getCourseDetails('0618', function (error, body, code) {
    if (error) {
        console.log('\t', error);
    }
    else if (body) {
        // If a course id is specified, result is not an array.
        if (!Array.isArray(body)) {
            body = [body];
        }

        for (var i in body) {
            var j = body[i];
            console.log('\t', j.ID, '-', j.Title);
            for (var k in j) {
                if (!k.match(/(title|id)/i)) {
                    console.log('\t  -', k, '-', j[k]);
                }
            }
        }
    }
    else {
        console.log('No information found.');
    }
});
```

**Output**

```
Get Information for course #0618:
         0618 - PreCalculus
          - LongDescription - PreCalculus
          - Notes -
          - ContentDescription -
          - NonAcademicOrHonorsCode -
          - SubjectArea1Code - D
          - SubjectArea2Code - J
          - SubjectArea3Code -
          - DepartmentCode - M
          - StateCourseCode - 2498
          - CSFCourseList - A
          - CollegePrepIndicatorCode - P
          - CreditDefault - 5
          - CreditMax - 10
          - TermTypeCode - Y
          - LowGrade - 10
          - HighGrade - 12
          - CSU_SubjectAreaCode - C
          - CSU_Rule_CanBeAnElective - G
          - CSU_Rule_HonorsCode -
          - UC_SubjectAreaCode - C
          - UC_Rule_CanBeAnElective - G
          - UC_Rule_HonorsCode -
          - PhysicalEducationIndicator - false
          - InactiveStatusCode -
```