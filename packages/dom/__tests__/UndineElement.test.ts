import Undine from '../lib'

describe('UndineElement', () => {
    it('should create an element with type, props, and children', () => {
        const element = Undine.createElement('div', { id: 'test' }, Undine.createElement('span', {}, 'Hello'));
        expect(element).toEqual({
            type: 'div',
            props: { id: 'test', children: [ { type: 'span', props: {}, children: [ 'Hello' ] } ] },
        });
    });
});