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
        return new URL('api/' + apiVersion.replace(/(^\/|\/$)/g, '') + '/' + e, this.url);
    }

    /**
     * Make an API call to Aeries.
     * @param {URL} url The url for the API.
     * @param {apiCallback} callback The callback that is called when the API call completes.
     */
    makeApiCall(url, callback) {
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

    /**
     * Get college test scores.
     * This will return a full history of all tests normally taken in preparation for college. These include: SAT I, SAT II, ACT, IB, and AP tests.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getCollegeTestsById(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'collegetestscores', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get assertive discipline.
     * This will return a full history of all "Assertive Discipline" records for all students in the selected school. This will include incidents from previous school years and those from different schools. An "Assertive Discipline" record normally represents a behavioral incident that resulted in punitive action.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getAssertiveDisciplineById(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'assertivediscipline', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get district supplemental information.
     * This will return student information from the "DSD" table in Aeries. This is a table that can be customized by each district with a set of fields that are consistent for all instances of a student record throughout the district (when the student is enrolled in multiple schools during the year).
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getAssertiveDisciplineById(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'districtsupplemental', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get fees and fines information.
     * This will return a full history of all fees and fines incurred by the student, including those that have already been paid.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getFeesAndFinesById(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'fees', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student pictures.
     * This will return the most recent photo of the student stored in Aeries.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getStudentPictureById(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'studentpictures', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student groups.
     * Student Groups are lists of students that schools have grouped together for any purpose, such as athletic team membership, club participation, academic reasons, special programs, etc.
     * @param {number|string} schoolCode The school code to use or "all" for all schools.
     * @param {apiCallback} callback
     */
    getStudentGroups(schoolCode, callback) {
        if (typeof schoolCode === 'function') {
            callback = schoolCode;
            schoolCode = 'all';
        }
        else if (schoolCode === null) {
            schoolCode = 'all';
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'StudentGroups'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student enrollment.
     * will return the enrollment history for one or all students.
     * @param {number} studentId The student id or 0 for all.
     * @param {apiCallback} callback
     */
    getStudentEnrollment(studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = 0;
        }
        else if (studentId === null) {
            studentId = 0;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'enrollment', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student enrollment.
     * will return the enrollment history for one or all students.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id or 0 for all.
     * @param {apiCallback} callback
     */
    getStudentEnrollmentAtSchool(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = 0;
        }
        else if (studentId === null) {
            studentId = 0;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'enrollment', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student enrollment.
     * will return the enrollment history for one or all students.
     * @param {number} schoolCode The school code to use.
     * @param {number} studentId The student id or 0 for all.
     * @param {number} year The academic year to limit to. e.g. 2017 for the 2017-2018 academic year
     * @param {apiCallback} callback
     */
    getStudentEnrollmentAtSchool(schoolCode, studentId, year, callback) {
        if (studentId === null) {
            studentId = 0;
        }

        if (year < 1900) {
            callback(new Error('Please enter a valid School Year.'), null, 500);
        }
        else {
            this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'enrollment', studentId, 'year', year), function (err, body, code) {
                callback(err, body, code);
            });
        }
    }

    /**
     * Get student attendance.
     * This will return detailed student attendance data for the selected school.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getAttendance(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'attendance', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student attendance.
     * This will return detailed student attendance data for the selected school.
     * @param {number} schoolCode The school code to use.
     * @param {string} startDate The start date of the range. YYYYMMDD
     * @param {string} endDate The end date of the range. YYYYMMDD
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getAttendanceByDateRange(schoolCode, startDate, endDate, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        var _url = this.makeApiUrl('v3', 'schools', schoolCode, 'attendance', studentId);
        _url.search = '?startDate=' + startDate + '&endDate=' + endDate;

        this.makeApiCall(_url, function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student attendance history.
     * This will return a summary of Attendance History data and can be limited to a specific student.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getAttendanceHistory(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'attendancehistory', 'summary', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student attendance history by year.
     * This will return a summary of Attendance History data for a school and academic year.
     * @param {number} schoolCode The school code to use.
     * @param {string} year The academic year in the format yyyy-yyyy e.g. "2017-2018"
     * @param {apiCallback} callback
     */
    getAttendanceHistoryByYear(schoolCode, year, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'attendancehistory', 'summary', 'year', year), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student grades.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getStudentGrades(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'gpas', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get student report cards.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getReportCards(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'reportcard', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get school report card marking periods.
     * @param {number} schoolCode The school code to use.
     * @param {apiCallback} callback
     */
    getReportCardMarkingPeriods(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'reportcardmarkingperiods'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get graduation requirements for a school.
     * @param {number} schoolCode The school code to use.
     * @param {apiCallback} callback
     */
    getGraduationRequirements(schoolCode, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'graduationrequirements'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get graduation status summary for a student or all students.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getGraduationSummary(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'graduationstatussummary', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get graduation status summary for all students at a school in the specified grade.
     * @param {number} schoolCode The school code to use.
     * @param {number} grade The grade to use.
     * @param {apiCallback} callback
     */
    getGraduationSummaryByGrade(schoolCode, grade, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'graduationstatussummary', 'grade', grade), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get transcript information for a student or all students at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getTranscript(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'transcript', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get class schedule for one student or all students at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} [studentId] The student id to use.
     * @param {apiCallback} callback
     */
    getClassSchedule(schoolCode, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'classes', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get course details for one or all courses.
     * @param {string} [courseId] The ID of the course to use.
     * @param {apiCallback} callback
     */
    getCourseDetails(courseId, callback) {
        if (typeof courseId === 'function') {
            callback = courseId;
            courseId = null;
        }

        this.makeApiCall(this.makeApiUrl('courses', courseId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get changes in Aeries courses from a certain point in time.
     * After you get the list of courses with changes, you will have to loop through the dataset and call the Course Information API one record at a time.
     * @param {number} year The year e.g. 2018
     * @param {number} month The month e.g. 3
     * @param {number} day The month e.g. 24
     * @param {number} hour The month e.g. 18
     * @param {number} minute The month e.g. 35
     * @param {apiCallback} callback
     */
    getCourseDataChanges(year, month, day, hour, minute, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'CourseDataChanges', year, month, day, hour, minute), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get staff information.
     * @param {number} [staffId] The ID of the staff member.
     * @param {apiCallback} callback
     */
    getStaffDetails(staffId, callback) {
        if (typeof staffId === 'function') {
            callback = staffId;
            staffId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'staff', staffId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get changes in Aeries staff data from a certain point in time.
     * After you get the list of staff with changes, you will have to loop through the dataset and call the Staff Information API one record at a time.
     * @param {number} year The year e.g. 2018
     * @param {number} month The month e.g. 3
     * @param {number} day The month e.g. 24
     * @param {number} hour The month e.g. 18
     * @param {number} minute The month e.g. 35
     * @param {apiCallback} callback
     */
    getStaffDataChanges(year, month, day, hour, minute, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'StaffDataChanges', year, month, day, hour, minute), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get teacher information for one or all teachers at a school.
     * @param {number} schoolCode The school code to use.
     * @param {number} [teacherId] The teacher id to use.
     * @param {apiCallback} callback
     */
    getTeachers(schoolCode, teacherId, callback) {
        if (typeof teacherId === 'function') {
            callback = teacherId;
            teacherId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'teachers', teacherId), function (err, body, code) {
            callback(err, body, code);
        });
    }

   /**
    * Returns a list of teacher records associated with the given Staff ID.
    * @param {number} staffId The staff id to use.
    * @param {apiCallback} callback
    */
    getStaffTeachers(schoolCode, staffId, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'staff', staffId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get master schedule section information.
     * If Section Number is not passed, all section records in the master schedule of the given school will be returned.
     * @param {number} schoolCode The school code to use.
     * @param {number} [sectionNumber] The section number to get.
     * @param {apiCallback} callback
     */
    getSection(schoolCode, sectionNumber, callback) {
        if (typeof sectionNumber === 'function') {
            callback = sectionNumber;
            sectionNumber = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'sections', sectionNumber), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get changes in section data from a certain point in time.
     * After you get the list of sections with changes, you will have to loop through the dataset and call the Section (from Master Schedule) API one record at a time.
     * @param {number} year The year e.g. 2018
     * @param {number} month The month e.g. 3
     * @param {number} day The month e.g. 24
     * @param {number} hour The month e.g. 18
     * @param {number} minute The month e.g. 35
     * @param {apiCallback} callback
     */
    getSectionDataChanges(year, month, day, hour, minute, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'sectiondatachanges', year, month, day, hour, minute), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get section class roster.
     * @param {number} schoolCode The school code to use.
     * @param {number} sectionNumber The section number to get.
     * @param {apiCallback} callback
     */
    getClassRoster(schoolCode, sectionNumber, callback) {
        this.makeApiCall(this.makeApiUrl('v1', 'schools', schoolCode, 'sections', sectionNumber, 'students'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get changes in section rosters from a certain point in time.
     * After you get the list of sections with roster changes, you will have to loop through the dataset and call the Section Class Roster API one record at a time.
     * @param {number} year The year e.g. 2018
     * @param {number} month The month e.g. 3
     * @param {number} day The month e.g. 24
     * @param {number} hour The month e.g. 18
     * @param {number} minute The month e.g. 35
     * @param {apiCallback} callback
     */
    getClassRosterChanges(year, month, day, hour, minute, callback) {
        this.makeApiCall(this.makeApiUrl('v2', 'sectionrosterdatachanges', year, month, day, hour, minute), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get gradebooks for a staff id.
     * @param {number} staffId The staff id to use.
     * @param {apiCallback} callback
     */
    getGradebookByStaffId(staffId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'staff', staffid, 'gradebooks'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get all gradebooks for students in a school and section.
     * @param {number} schoolCode The school code to use.
     * @param {number} sectionNumber The section number to get.
     * @param {apiCallback} callback
     */
    getGradebookBySection(schoolCode, sectionNumber, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'schools', schoolCode, 'sections', sectionNumber, 'gradebooks'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get a gradebook by gradebook id.
     * @param {number} gradebookId The id of the gradebook to get.
     * @param {apiCallback} callback
     */
    getGradebookById(gradebookId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', gradebookId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get one or all assignments in a gradebook.
     * @param {number} gradebookId
     * @param {number} [assignmentId]
     * @param {apiCallback} callback
     */
    getGradebookAssignments(gradebookId, assignmentId, callback) {
        if (typeof assignmentId === 'function') {
            callback = assignmentId;
            assignmentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', gradebookId, 'assignments', assignmentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get a gradebook assignment by unique gradebook id.
     * @param {number} uniqueId The unique id of the gradebook to get.
     * @param {apiCallback} callback
     */
    getGradebookAssugnmentByUniqueId(uniqueId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', 'assignments', uniqueId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get the final marks for a gradebook.
     * @param {number} gradebookId
     * @param {apiCallback} callback
     */
    getGradebookFinalMarks(gradebookId, callback) {
        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', gradebookId, 'finalmarks'), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get gradebook student information for a given gradebook and term. 
     * @param {number} gradebookId
     * @param {string} gradebookTerm
     * @param {number} [studentId]
     * @param {apiCallback} callback
     */
    getGradebookStudentInfo(gradebookId, gradebookTerm, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', gradebookId, gradebookTerm, 'students', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get the scores for an assignment with the optional limit to a specific student.
     * @param {number} gradebookId
     * @param {number} assignmentId
     * @param {number} [studentId]
     * @param {apiCallback} callback
     */
    getGradebookAssignmentScores(gradebookId, assignmentId, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', gradebookId, 'assignments', assignmentId,  'scores', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }

    /**
     * Get the scores for an assignment with the optional limit to a specific student.
     * @param {number} uniqueId
     * @param {number} [studentId]
     * @param {apiCallback} callback
     */
    getGradebookAssignmentScoresByUniqueId(uniqueId, studentId, callback) {
        if (typeof studentId === 'function') {
            callback = studentId;
            studentId = null;
        }

        this.makeApiCall(this.makeApiUrl('v3', 'gradebooks', 'assignments', uniqueId, 'scores', studentId), function (err, body, code) {
            callback(err, body, code);
        });
    }
}

module.exports = aeriesjs;