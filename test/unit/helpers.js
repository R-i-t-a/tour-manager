const getErrors = (validation, numberExpected) => {
    expect(validation).toBeDefined(); // toBeDefined() is a jest method
    const errors = validation.errors;
    expect(Object.keys(errors)).toHaveLength(numberExpected);
    return errors;
};

module.exports = {
    getErrors
};
