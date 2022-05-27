const db = require('./db/databaseConnector');
const Errors = require('./models/Errors');
const emojiStrip = require('emoji-strip');

/**
 * Receive the token from a bearer token.
 * @param bearerToken token inclusive 'Bearer '
 * @returns {*|string} The plain text token.
 */
function stripBearerToken(bearerToken) {
    return bearerToken.split(" ")[1];
}

/**
 * Check if the email from the parameters exists in the psychologist table.
 * @param email Psychologist email.
 * @param cb Callback method (error, psychRows)
 */
function checkIfEmailIsPsychologistEmail(email, cb) {
    // Select the psychologist email from the database.
    db.query("SELECT email FROM ni1783395_2_DB.Psychologist WHERE email = ?;", [email], (error, rows, fields) => {
        // If there is a database error.
        if (error) {
            cb(Errors.conflict(), null);
        } else if (rows.length < 1) {
            // If the email does not exists in the psychologist table.
            cb(Errors.notFound(), null);
        } else {
            // Return the rows in a callback when the psychologist exists.
            cb(null, rows);
        }
    })
}

/**
 * Check if the email from the parameters exists in the client table.
 * @param email Client email.
 * @param cb Callback method (error, clientRows).
 */
function checkIfEmailIsClientEmail(email, cb) {
    db.query("SELECT email FROM ni1783395_2_DB.User WHERE email = ?;", [email], (error, rows, fields) => {
        // If there is a database error.
        if (error) {
            cb(Errors.conflict(), null);
        } else if (rows.length < 1) {
            // If the email does not exists in the psychologist table.
            cb(Errors.notFound(), null);
        } else {
            // Return the rows in a callback when the psychologist exists.
            cb(null, rows);
        }
    })
}

/**
 * This function checks if the string contains any emoji it is replaced with an empty string.
 */
function checkEmoji(string) {
    return emojiStrip(string);
}

//U+1F60x

module.exports = {
    stripBearerToken,
    checkIfEmailIsPsychologistEmail,
    checkIfEmailIsClientEmail,
    checkEmoji
};