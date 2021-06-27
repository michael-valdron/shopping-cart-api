import * as util from '../../api/util'

test('testErrorResponse', () => {
    const msg = "An error message.";
    expect(util.errorResponse(msg)).toEqual({
        status: 'error',
        message: msg
    });
});

test('testRoundTo', () => {
    expect(util.roundTo(1.234, 2)).toEqual(1.23);
});
