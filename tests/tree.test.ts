import { listToTree, treeWalk, treePath, treeToList, treeFilter } from '../src'

const tree = [
  {
    id: 1,
    pid: 0,
    name: '测试1',
    children: [{ id: 3, pid: 1, name: '测试3' }]
  },
  {
    id: 2,
    pid: 0,
    name: '测试2'
  }
]

const treeDeep = [
  {
    id: 1,
    name: 'node1',
    children: [
      {
        id: 3,
        name: 'node3',
        children: [
          {
            id: 5,
            name: 'node5',
            children: [
              { id: 6, name: 'node6' },
              { id: 7, name: 'node7' }
            ]
          }
        ]
      },
      { id: 4, name: 'node4' }
    ]
  },
  {
    id: 2,
    name: 'node2',
    children: [
      { id: 8 }
    ]
  }
]

test('listToTree', () => {
  const list = [
    { id: 1, pid: 0, name: '测试1' },
    { id: 2, pid: 0, name: '测试2' },
    { id: 3, pid: 1, name: '测试3' }
  ]

  expect(listToTree(list)).toEqual(tree)
})

test('treeWalk', () => {
  expect(treeWalk({})).toEqual({})
  expect(treeWalk({ id: 1 })).toEqual({ id: 1 })
  expect(treeWalk([{ id: 1 }])).toEqual([{ id: 1 }])
  expect(treeWalk(tree)).toEqual(tree)

  expect(
    treeWalk(tree, {
      eachBefore: node => ({
        id: node.id * 10,
        name: `${node.id}-${node.name}`
      })
    })
  ).toEqual([
    {
      id: 10,
      name: '1-测试1',
      children: [{ id: 30, name: '3-测试3' }]
    },
    { id: 20, name: '2-测试2' }
  ])

  expect(
    treeWalk(tree, {
      eachBefore: node => ({
        id: node.id * 10,
        name: `${node.id}-${node.name}`,
        children: [{ id: node.id * 11 }, { id: node.id * 22 }]
      })
    })
  ).toEqual([
    {
      id: 10,
      name: '1-测试1',
      children: [
        { id: 11 },
        { id: 22 },
        {
          id: 30,
          name: '3-测试3',
          children: [{ id: 33 }, { id: 66 }]
        }
      ]
    },
    { id: 20, name: '2-测试2', children: [{ id: 22 }, { id: 44 }] }
  ])

  expect(
    treeWalk(tree, {
      extraChildrenInsertAfter: true,
      eachBefore: node => ({
        id: node.id * 10,
        name: `${node.id}-${node.name}`,
        children: [{ id: node.id * 11 }, { id: node.id * 22 }]
      })
    })
  ).toEqual([
    {
      id: 10,
      name: '1-测试1',
      children: [
        {
          id: 30,
          name: '3-测试3',
          children: [{ id: 33 }, { id: 66 }]
        },
        { id: 11 },
        { id: 22 }
      ]
    },
    { id: 20, name: '2-测试2', children: [{ id: 22 }, { id: 44 }] }
  ])

  expect(
    treeWalk(tree, {
      eachBefore: node => ({
        id: node.id * 10,
        name: `${node.id}-${node.name}`
      }),
      eachAfter: node => ({
        after: `${node.id}`
      })
    })
  ).toEqual([
    {
      after: '10',
      children: [{ after: '30' }]
    },
    { after: '20' }
  ])
})

test('treePath', () => {
  expect(
    treePath(treeDeep, node => node.id == 1, 'id')
  ).toEqual([
    { id: 1 }
  ])

  expect(
    treePath(treeDeep, node => node.id == 5, 'id,name')
  ).toEqual([
    { id: 1, name: 'node1' },
    { id: 3, name: 'node3' },
    { id: 5, name: 'node5' },
  ])

  expect(
    treePath(treeDeep, node => node.id == 2)
  ).toEqual([
    {
      id: 2,
      name: 'node2',
      children: [
        { id: 8 }
      ]
    }
  ])

  expect(
    treePath(treeDeep, node => node.id == 7, 'id')
  ).toEqual([
    { id: 1 },
    { id: 3 },
    { id: 5 },
    { id: 7 },
  ])
})

test('treeToList', () => {
  expect(
    treeToList(tree, 'id,pid,name')
  ).toEqual([
    { id: 1, pid: 0, name: '测试1' },
    { id: 3, pid: 1, name: '测试3' },
    { id: 2, pid: 0, name: '测试2' },
  ])

  expect(
    treeToList(tree, 'id')
  ).toEqual([
    { id: 1 },
    { id: 3 },
    { id: 2 },
  ])

  expect(
    treeToList(tree, node => node.id)
  ).toEqual([ 1, 3, 2 ])
})

test('treeFilter', () => {
  expect(
    treeFilter(tree, node => node.id != 3)
  ).toEqual([
    { id: 1, pid: 0, name: '测试1', children: [] },
    { id: 2, pid: 0, name: '测试2' },
  ])

  expect(
    treeFilter(tree, node => node.id != 1)
  ).toEqual([
    { id: 2, pid: 0, name: '测试2' },
  ])

  expect(
    treeFilter(tree, node => node.id == 1)
  ).toEqual([
    { id: 1, pid: 0, name: '测试1', children: [] },
  ])

  expect(
    treeFilter(tree, node => node.id == 3 || node.id == 2)
  ).toEqual([
    { id: 2, pid: 0, name: '测试2' },
  ])
})
