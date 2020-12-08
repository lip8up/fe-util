/**
 * 生成 tree，遍历 tree，转换 tree
 * @author zhangpeng
 */
import { groupBy } from 'lodash'
import { MapType } from './types'
import { objectSlice } from './object'

/**
 * Tree 通用选项
 */
export interface TreeOptions {
  /** 生成的 tree 数据中，包含子级列表的 key */
  childrenKey?: string
}

/**
 * Treee 通用选项的默认值
 */
export const treeDefaultOptions: TreeOptions = {
  childrenKey: 'children'
}

/**
 * listToTree 工具函数选项
 */
export interface ListToTreeOptions extends TreeOptions {
  /** 主键 key */
  idKey?: string
  /** 父级 key */
  parentKey?: string
  /** 根节点的值 */
  rootValue?: any
}

/**
 * listToTree 默认选项
 */
export const listToTreeDefaultOptions = {
  ...treeDefaultOptions,
  idKey: 'id',
  parentKey: 'pid',
  rootValue: 0
}

const makeTree = (list: any[], group: MapType<any[]>, opts: ListToTreeOptions) => {
  list.forEach(it => {
    const id = it[opts.idKey!]
    const children = group[id]
    if (children != null) {
      it[opts.childrenKey!] = children
      makeTree(children, group, opts)
    }
  })
}

/**
 * 将平坦化的数组数据，加工成 tree
 * @param list 数组
 * @param options 选项，默认选项参见 [[listToTreeDefaultOptions]]
 */
export function listToTree(list: any[], options = {} as ListToTreeOptions) {
  const opts = { ...listToTreeDefaultOptions, ...options }
  const group = groupBy(list, opts.parentKey)
  const root = group[opts.rootValue] || []
  makeTree(root, group, opts)
  return root
}

/**
 * treeWalk 选项
 */
export interface TreeWalkOptions<T> extends TreeOptions {
  /**
   * 可以在 eachBefore 时，添加额外的 children，该选项控制额外的 children 是否添加到最后，
   * 默认为 false，即额外的 children 添加到前面
   */
  extraChildrenInsertAfter?: boolean

  /**
   * 遍历每一个节点之前时的回调
   * @param node 当前节点
   * @param parentNodes 所有父级节点
   * @return 可以返回新节点，也可什么都不返回，返回新节点将生成一棵新的树
   */
  eachBefore?(node: T, parentNodes: any[]): any

  /**
   * 遍历每一个节点之后时的回调，若明确地返回 false，则删除该节点
   * @param newNode 当前新节点，注意与 eachBefore 的区别，这里是 eachBefore 返回的新节点
   * @param parentNodes 所有父级节点
   * @return 可以返回新节点，也可什么都不返回，返回新节点将生成一棵新的树
   */
  eachAfter?(newNode: any, parentNodes: any[]): any
}

// 深度优先遍历树，树的节点必须为对象
const doWalkTree = <T>(nodes: T[], opts: TreeWalkOptions<T>, parentNodes: any[]) => {
  const childrenKey = opts.childrenKey!

  const list = (nodes || []).map(node => {
    const newNode = opts.eachBefore!(node, parentNodes) || node

    const children = (node as any)[childrenKey]
    if (children != null) {
      // 确保 parentNodes 里都是新节点，此时刚添加的新节点还没有 children
      const newParentNodes = [...parentNodes].concat(newNode)

      // 深度遍历子节点
      const newChildren = doWalkTree(children, opts, newParentNodes) || children

      // 如果新节点是全新节点，支持在 newNode 中添加扩展 children
      // 只有是全新节点时，才获取全新节点中的子节点
      const extraChildren = (newNode !== node && newNode[childrenKey]) || []

      // 与处理后的原节点的子节点进行合并
      const newNodeChildren = opts.extraChildrenInsertAfter!
        ? newChildren.concat(extraChildren)
        : extraChildren.concat(newChildren)

      // 重新赋值给新节点
      newNode[childrenKey] = newNodeChildren
    }

    // 若 eachAfter 明确地返回 false，则删除该节点
    // 为了方便，若 eachAfter 明确地返回 true，则保留该节点
    const afterNode = opts.eachAfter!(newNode, parentNodes)
    const finalNode = afterNode === false
      ? null
      : afterNode === true
      ? newNode
      : (afterNode || newNode)

    // 若最后的 node，取自 eachAfter 的返回值，但又没有 children，
    // 则使用 newNode 的 children 补充
    if (
      finalNode === afterNode &&
      finalNode[childrenKey] === undefined &&
      newNode[childrenKey] !== undefined
    ) {
      finalNode[childrenKey] = newNode[childrenKey]
    }

    return finalNode
  })

  // 过滤掉为 null 的节点
  const result = list.filter(it => it != null)

  return result
}

/**
 * walkTree 默认选项
 */
export const treeWalkDefaultOptions = {
  ...treeDefaultOptions,
  eachBefore: () => {},
  eachAfter: () => {},
  extraChildrenInsertAfter: false
}

/**
 * 遍历 tree，并执行特定的动作
 * @param tree 要遍历的 tree
 * @param options 选项
 */
export function treeWalk<T>(tree: T | T[], options = {} as TreeWalkOptions<T>) {
  const opts = { ...treeWalkDefaultOptions, ...options }
  const nodes = Array.isArray(tree) ? tree : [tree]
  const result = doWalkTree(nodes, opts, [])
  return Array.isArray(tree) ? result : result[0]
}

/**
 * treePath 节点查找函数，返回 true 表示找到了节点
 */
export type TreePathTest<T> = (node: T, parentNodes: any[]) => boolean

/**
 * treePath 节点提取函数
 */
export type TreePathTake<T> = (node: T) => any

/**
 * 寻找节点路径
 * @param tree 树
 * @param find 节点查找函数
 * @param take 节点提取函数
 *        1、若为 string 或 string[]，则为属性提取，相当于 node => objectSlice(node, take)
 *        2、若不提供，则提取整个节点，相当于 node => node
 */
export function treePath<T>(
  tree: T | T[],
  find: TreePathTest<T>,
  take?: string | string[] | TreePathTake<T>
) {
  let path: T[] = []
  const takeFunc = take === undefined
    ? (node: T) => node
    : typeof take === 'string' || Array.isArray(take)
    ? (node: T) => objectSlice(node, take)
    : take
  treeWalk(tree, {
    // TODO: 优化成查找成功，则终止查找
    eachBefore(node, parentNodes) {
      if (find(node, parentNodes) === true) {
        path = [...parentNodes, node].map(takeFunc)
      }
    }
  })
  return path
}

/**
 * 提取 tree 节点，组成一个新的列表返回
 * @param tree 树
 * @param take 节点提取函数，若为 string 或 string[]，则为属性提取，相当于 node => objectSlice(node, take)
 */
export function treeToList<T>(
  tree: T | T[],
  take: string | string[] | TreePathTake<T>
) {
  let list: any = []
  const takeFunc = typeof take === 'string' || Array.isArray(take)
    ? (node: T) => objectSlice(node, take)
    : take
  treeWalk(tree, {
    eachBefore(node) {
      list = list.concat(takeFunc(node))
    }
  })
  return list
}

/**
 * 过滤掉树中的某个节点
 * @param tree 树
 * @param filter 过滤函数，明确返回 false 的会被过滤掉
 */
export function treeFilter<T>(
  tree: T | T[],
  filter: TreePathTest<T>,
) {
  const result = treeWalk(tree, {
    eachAfter(node, parentNodes) {
      return filter(node, parentNodes)
    }
  })
  return result
}
