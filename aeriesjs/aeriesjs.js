'use strict';

let request = require('request');
let { URL } = require('url');

/**
 * @typedef initOptions
 * @type {Object}
 * @property {string} certificate The Aeries API Certificate string.
 * @property {string} url The Url of the Aeries API.
 * @property {boolean} verifyCerts Should SSL Certificates be validated?
*/

/**
 *  The callback function for API calls.
 * @callback apiCallback
 * @param {error} error An error object if an error has occured.
 * @param {object} body The response body.
 * @param {number} statusCode The API response status code.
 */

class aeriesjs {

    /**
     * aeriesjs
     * @param {initOptions} options The options for the api.
     */
    constructor(options) {
        this.options = Object.assign({
            certificate: null,
            verifyCerts: true,
            url: null
        }, options);

        if (!this.options.verifyCerts) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }
    }

    /**
     * Gets the currently configured Aeries API Certificate.
     */
    get certificate() {
        return this.options.certificate;
    }

    /**
     * Gets the currently configured Aeries Url.
     */
    get url() {
        return this.options.url;
    }

    /**
     * Gets the currently configured Aeries API Version.
     */
    get apiVersion() {
        return this.options.apiVersion;
    }


    /**
     * Builds an Aeries API Endpoint URL.
     * @param {string} apiVersion The version of the API for the endpoint.
     * @param {...string} args The Aeries Endpoint you wish to get a URL for, e.g. schools, schools/100
     */
    makeApiUrl(apiVersion, args) {
        if (!apiVersion) apiVersion = 'v3';

        var i = 1, n = arguments.length, e = '';
        for (; i < n; i++) {
            if (arguments[i] !== null) {
                e += arguments[i].toString().replace(/(^\/|\/$)/g, '') + '/';
            }
        }
        return new URL('api/' + apiVersion + '/' + e, this.url);
    }

    /**
     * Make an API call to Aeries.
     * @param {URL} url The url for the API.
     * @param {apiCallback} callback The callback that is called when the API call completes.
     */
    makeApiCall(url, callback) {
        console.log(url.toString());
        var rOptions = {
            url: url.toString(),
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'AERIES-CERT': this.certificate || ''
            }
        };
        var _r = request(rOptions, function (err, response, body) {
            if (body) {
                try {
                    var jBody = JSON.parse(body);
                    callback(err, jBody, response ? response.statusCode : 500);
                }
                catch (e) {
                    callback(e, body, response ? response.statusCode : 500);
                }
            }
            else {
                callback(null, null, response ? response.statusCode : 500);
            }
        });
    }

    /**
     * Get's a list of schools.
     * @param {apiCallback} callback
     */
    getSchools(callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Gets information for a specific school.
     * @param {number} schoolCode
     * @param {apiCallback} callback
     */
    getSchool(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get's the term information for a school.
     * @param {number} schoolCode The school to get information for.
     * @param {apiCallback} callback
     */
    getSchoolTerms(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'terms'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get's the calendar information for a school.
     * @param {number} schoolCode The school to get information for.
     * @param {apiCallback} callback
     */
    getSchoolTerms(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'calendar'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get's the bell schedule for a school.
     * @param {number} schoolCode The school to get information for.
     * @param {number} [day] The specific day to get. (optional)
     * @param {apiCallback} callback
     */
    getSchoolBellSchedule(schoolCode, day, callback) {
        if (typeof day === 'function') {
            callback = day;
            day = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'bellschedule', day), function (err, body, code) {
            callback(err, body, code);
        });
    }


    /**
     * Get's the bell schedule for a school.
     * @param {number} schoolCode The school to get information for.
     * @param {string} [code] The specific code to get. (optional)
     * @param {apiCallback} callback
     */
    getSchoolAbsenceCodes(schoolCode, code, callback) {
        if (typeof code === 'function') {
            callback = code;
            code = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'AbsenceCodes', code), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Gets the code values for a specific table and field.
     * @param {string} table The Aeries table to look up codes for.
     * @param {string} field The field in the table to lookup codes for.
     * @param {apiCallback} callback
     */
    getCodes(table, field, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'codes', table, field), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get all of the students at a school.
     * @param {number} schoolCode The school code to use.
     * @param {apiCallback} callback
     */
    getStudents(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get all of the students at a school in a specific grade.
     * @param {number} schoolCode The school code to use.
     * @param {number} grade The student grade to use.
     * @param {apiCallback} callback
     */
    getStudentsInGrade(schoolCode, grade, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', 'grade', grade), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get information about a specific student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentNumber The student number to use.
     * @param {apiCallback} callback
     */
    getStudentByNumber(schoolCode, studentNumber, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', 'sn', studentNumber), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get information about a specific student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id to use.
     * @param {apiCallback} callback
     */
    getStudentById(schoolCode, studentId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get extended information about a specific student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id to use.
     * @param {apiCallback} callback
     */
    getStudentById(schoolCode, studentId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', studentId, 'extended'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get extended information for all of the students at a school in a specific grade.
     * @param {number} schoolCode The school code to use.
     * @param {number} grade The grade to use.
     * @param {apiCallback} callback
     */
    getStudentsInGradeExtended(schoolCode, grade, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', 'grade', grade, 'extended'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get information about a specific student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentNumber The student number to use.
     * @param {apiCallback} callback
     */
    getStudentByNumberExtended(schoolCode, studentNumber, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'students', 'sn', studentNumber, 'extended'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get changes in Aeries data from a certain point in time.
     * @param {string} dataArea The area to get changes from, e.x. "student", "contact", "program", "test", "class", "enrollment"
     * @param {number} year The year e.g. 2018
     * @param {number} month The month e.g. 3
     * @param {number} day The month e.g. 24
     * @param {number} hour The month e.g. 18
     * @param {number} minute The month e.g. 35
     * @param {apiCallback} callback
     */
    getStudentDataChanges(dataArea, year, month, day, hour, minute, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'StudentDataChanges', dataArea, year, month, day, hour, minute), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get all of the contacts for students.
     * @param {number} schoolCode The school code to use.
     * @param {apiCallback} callback
     */
    getContacts(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'contacts'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get the contacts for a student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id to use.
     * @param {apiCallback} callback
     */
    getContactsById(schoolCode, studentId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'contacts', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }


    /**
     * Get the programs for a student at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id to use. Use 0 for all students.
     * @param {number} [code] A program code to filter by. e.g. 144
     * @param {apiCallback} callback
     */
    getProgramsById(schoolCode, studentId, code, callback) {
        if (typeof code === 'function') {
            callback = code;
            code = null;
        }

        var _url = this.makeApiUrl('v3', 'schools', schoolCode, 'students', studentId, 'programs');

        if (code) {
            _url.search = '?code=' + code.toString();
        }

        this.makeApiCall(_url, function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get the test results for a student.
     * This will return a full history of all State and locally administered Standardized Tests in Aeries. This does not include SAT I, SAT II, ACT, IB, or AP tests though. Examples include CST, CAHSEE, and CELDT.
     * @param {number} studentId The student id to use.
     * @param {apiCallback} callback
     */
    getTestsById(studentId, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'students', studentId, 'tests'), function (err, body, code) {
            callback(err, body, code);
        });
    }
}

module.exports = aeriesjs;