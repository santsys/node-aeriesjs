'use strict';

let api = require('./aeriesjs');

var aeries = new api({
    certificate: '477abe9e7d27439681d62f4e0de1f5e1',
    url: 'https://demo.aeries.net/aeries/',
});

console.log('The current certificate is: ' + aeries.certificate);

console.log(aeries.makeApiUrl('/schools/', 999).toString());

//console.log('Getting list of schools: ');

//aeries.getSchools(function (error, body, code) {
//    if (error) {
//        console.log('\t', error);
//    }
//    else {
//        for (var i in body) {
//            var s = body[i];
//            if (s) {
//                console.log('\t', s.SchoolCode, ' - ', s.Name);
//            }
//        }
//    }
//});

//console.log('Getting information for school 990:');
//aeries.getSchoolAbsenceCodes(990, function (error, body, code) {
//    if (error) {
//        console.log('\t', error);
//    }
//    else if (body) {
//        for (var i in body) {
//            var s = body[i];
//            for (var k in s) {
//                console.log('\t', k, '-', s[k]);
//            }
//        }
//    }
//    else {
//        console.log('No school information found.');
//    }
//});

console.log('Students at school 990 with a program 144 record:');
aeries.getProgramsById(990, 0, 144, function (error, body, code) {
    if (error) {
        console.log('\t', error);
    }
    else if (body) {
        for (var i in body) {
            var s = body[i];
            console.log('\t', s.StudentID, '-', s.ProgramDescription, '(' + s.ProgramCode + ')'); 
        }
    }
    else {
        console.log('No information found.');
    }
});