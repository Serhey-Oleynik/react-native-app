/* eslint-env mocha */

import assert from 'assert'
import Store from '../Store'

suite('apis/StyleSheet/Store', () => {
  suite('the constructor', () => {
    test('initialState', () => {
      const initialState = { classNames: { 'alignItems:center': '__classname__' } }
      const store = new Store(initialState)
      assert.deepEqual(store._classNames['alignItems:center'], '__classname__')
    })
  })

  suite('#get', () => {
    test('returns a declaration-specific className', () => {
      const initialState = {
        classNames: {
          'alignItems:center': '__expected__',
          'alignItems:flex-start': '__error__'
        }
      }
      const store = new Store(initialState)
      assert.deepEqual(store.get('alignItems', 'center'), '__expected__')
    })
  })

  suite('#set', () => {
    test('stores declarations', () => {
      const store = new Store()
      store.set('alignItems', 'center')
      store.set('flexGrow', 0)
      store.set('flexGrow', 1)
      store.set('flexGrow', 2)
      assert.deepEqual(store._declarations, {
        alignItems: [ 'center' ],
        flexGrow: [ 0, 1, 2 ]
      })
    })

    test('human-readable classNames', () => {
      const store = new Store()
      store.set('alignItems', 'center')
      store.set('flexGrow', 0)
      store.set('flexGrow', 1)
      store.set('flexGrow', 2)
      assert.deepEqual(store._classNames, {
        'alignItems:center': 'alignItems:center',
        'flexGrow:0': 'flexGrow:0',
        'flexGrow:1': 'flexGrow:1',
        'flexGrow:2': 'flexGrow:2'
      })
    })

    test('obfuscated classNames', () => {
      const store = new Store({}, { obfuscateClassNames: true })
      store.set('alignItems', 'center')
      store.set('flexGrow', 0)
      store.set('flexGrow', 1)
      store.set('flexGrow', 2)
      assert.deepEqual(store._classNames, {
        'alignItems:center': '_s_1',
        'flexGrow:0': '_s_2',
        'flexGrow:1': '_s_3',
        'flexGrow:2': '_s_4'
      })
    })

    test('replaces space characters', () => {
      const store = new Store()

      store.set('margin', '0 auto')
      assert.equal(store.get('margin', '0 auto'), 'margin\:0-auto')
    })
  })

  suite('#toString', () => {
    test('human-readable style sheet', () => {
      const store = new Store()
      store.set('alignItems', 'center')
      store.set('backgroundColor', 'rgba(0,0,0,0)')
      store.set('color', '#fff')
      store.set('fontFamily', '"Helvetica Neue", Arial, sans-serif')
      store.set('marginBottom', '0px')
      store.set('width', '100%')

      const expected = '/* 6 unique declarations */\n' +
          '.alignItems\\:center{align-items:center;}\n' +
          '.backgroundColor\\:rgba\\(0\\,0\\,0\\,0\\){background-color:rgba(0,0,0,0);}\n' +
          '.color\\:\\#fff{color:#fff;}\n' +
          '.fontFamily\\:\\"Helvetica-Neue\\"\\,-Arial\\,-sans-serif{font-family:"Helvetica Neue", Arial, sans-serif;}\n' +
          '.marginBottom\\:0px{margin-bottom:0px;}\n' +
          '.width\\:100\\%{width:100%;}'

      assert.equal(store.toString(), expected)
    })

    test('obfuscated style sheet', () => {
      const store = new Store({}, { obfuscateClassNames: true })
      store.set('alignItems', 'center')
      store.set('marginBottom', '0px')
      store.set('margin', '1px')
      store.set('margin', '2px')
      store.set('margin', '3px')

      const expected = '/* 5 unique declarations */\n' +
          '._s_1{align-items:center;}\n' +
          '._s_3{margin:1px;}\n' +
          '._s_4{margin:2px;}\n' +
          '._s_5{margin:3px;}\n' +
          '._s_2{margin-bottom:0px;}'

      assert.equal(store.toString(), expected)
    })
  })
})
