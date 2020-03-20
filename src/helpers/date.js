import moment from 'moment';

export const MONTH_YEAR_FORMAT = 'MMM YYYY';

export const DEFAULT_FORMAT = 'DD-MM-YYYY';

export const getDate = date => moment(date, DEFAULT_FORMAT).format(MONTH_YEAR_FORMAT);
