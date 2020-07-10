const getSessionUser = ({ id, username }) => ({ id, username });

const getValidatorErrors = (errors) => Object.values(errors).flat();

module.exports = { getSessionUser, getValidatorErrors };
