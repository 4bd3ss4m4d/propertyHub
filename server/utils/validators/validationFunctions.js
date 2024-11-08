import iso6391 from 'iso-639-1';
import currencyCodes from 'currency-codes';
import moment from 'moment-timezone';

// Currency validation
export const validateCurrency = (code) => currencyCodes.code(code) !== undefined;

// Language validation
export const validateLanguage = (code) => iso6391.validate(code);

// Timezone validation
export const validateTimezone = (zone) => moment.tz.zone(zone) !== null;
