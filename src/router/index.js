const Bind = () => import('@/pages/Bind/Bind')
const Forget = () => import('@/pages/Bind/Forget')
const authorization = () => import('@/pages/Bind/authorization')
const Home = () => import('@/pages/Home/Home')
const My = () => import('@/pages/My/My')
const Message = () => import('@/pages/Message/Message')
/** 我要采购 */
const Gopurchase = () => import('@/pages/Home/Gopurchase')
/** 商品详情页 */
const GoodsDetail = () => import('@/pages/Home/goodsDetail')
/** 进货车页面（进货车页面可以删除已选择商品） */
const GoTruck = () => import('@/pages/Home/GoTruck')
/** 去结算，确认订单页 */
const GoSettlement = () => import('@/pages/Home/GoSettlement')
/** 上传凭证页面 */
const Subvoucher = () => import('@/pages/Home/Subvoucher')
/** 支付成功页面 */
const paySuccess = () => import('@/pages/Home/paySuccess')
/** 订单列表页面 */
const myOrders = () => import('@/pages/Home/myOrders')
/** 订单详情页面 */
const orderDetail = () => import('@/pages/Home/orderDetail')
/** 下级发货的订单详情页面 */
const xjOrderDetail = () => import('@/pages/Home/XJorderDetail')
/** 我的云仓库 */
const YCK = () => import('@/pages/Home/YCK')
/** 我的库存记录 */
const KCJL = () => import('@/pages/Home/YCK-KCJL')
/** 我的提货订单 */
const THDD = () => import('@/pages/Home/YCK-THDD')
/** 我的提货订单 */
const THDDDetail = () => import('@/pages/Home/YCK-THDDDetail')
/** 库存详情 */
const KCDetail = () => import('@/pages/Home/YCK-KCDetail')
/** 我的库存下商品列表 */
const GoodsList = () => import('@/pages/Home/YCK-GoodsList')
/** 云库存立即提货 */
const yckSettlement = () => import('@/pages/Home/YCK-goSettlement')

/** 进货关系网 */
const JHRelation = () => import('@/pages/Home/JH-relation')
/** 进货上级信息 */
const LeaderMsg = () => import('@/pages/Home/JH-leadermsg')
/** 团队信息（搜索显示点击查看显示） */
const teamMsg = () => import('@/pages/Home/JH-teamList')
/** 代理详情 */
const agentDetail = () => import('@/pages/Home/JH-agentDetail')
/** 代理详情的库存列表 */
const agentKCList = () => import('@/pages/Home/JH-kcList')

/** 邀请关系网 */
const YQRelation = () => import('@/pages/Home/YQ-relation')
/** 邀请上级信息 */
const YQLeaderMsg = () => import('@/pages/Home/YQ-leadermsg')
/** 邀请的团队信息（搜索显示点击查看显示） */
const YQteamMsg = () => import('@/pages/Home/YQ-teamList')
/** 邀请的代理详情 */
const YQagentDetail = () => import('@/pages/Home/YQ-agentDetail')

/** 首页授权证书 */
const SQZS = () => import('@/pages/Home/certificate')
/** 首页升级处理 */
const UpgradeLevel = () => import('@/pages/Home/Upgrade-processing')
/** 我的 （或者下级的）升级记录 */
const recordList = () => import('@/pages/Home/Upgrade-recordList')
/** 升级记录详情 */
const RecordDetail = () => import('@/pages/Home/Upgrade-recordDeatil')

/** 邀请代理 */
const InvitationAgent = () => import('@/pages/Home/InvitationAgent')
const CreateLink = () => import('@/pages/Home/CreateLink')
/** 审核代理 */
const ExamineList = () => import('@/pages/Home/ExamineList')

/** 撤单申请 */
const applyCancelOrder = () => import('@/pages/Home/applyCancelOrder')
/** 打款凭证 */
const payPZ = () => import('@/pages/Home/payPZ')

/** 下级进货订单列表页面 */
const otherOrders = () => import('@/pages/Home/otherpurchaseOrders')
/** 下级进货缺货商品统计（可以一键补货） */
const waitSend = () => import('@/pages/Home/goodsWaitSend')
/** 我的业绩 */
const myAchieve = () => import('@/pages/Home/MyAchieve')
/** 我的业绩详情 */
const myAchieveDetail = () => import('@/pages/Home/MyAchieve-detail')
/** 我的业绩历史 */
const myAchieveHistory = () => import('@/pages/Home/MyAchieve-detail-history')
/** 我的业绩历史详情列表 */
const myAchieveHistoryList = () => import('@/pages/Home/MyAchieve-detail-history-detail')
/** 申请代理商页面 */
const firstStep = () => import('@/pages/applyJoin/firstStep')
const secondStep = () => import('@/pages/applyJoin/secondStep')
const thirdStep = () => import('@/pages/applyJoin/thirdStep')
/** 准代理资料详情 */
const preAgentDetail = () => import('@/pages/applyJoin/preAgentDetail')

/** 我的页面下编辑个人资料页 */
const setMyInfo = () => import('@/pages/My/setMyInfo')
/** 个人资料具体页面 */
const MyInfoDetail = () => import('@/pages/My/MyInfoDetail')
/** 我的贷款账户页面 */
const DK = () => import( '@/pages/My/DK')
/** 我的提现账户页面 */
const TX = () => import('@/pages/My/TX')
/** 我的提现账户待结算页面 */
const TXDJS = () => import('@/pages/My/TX-DJS')
/** 我的提现中页面 */
const TXING = () => import('@/pages/My/TX-ING')
/** 我的提现详情 */
const TXDetail = () => import('@/pages/My/TX-Detail')
/** 我的提现申请 */
const TXSQ = () => import('@/pages/My/TX-SQ')
/** 我的收入账单 */
const TXSRZD = () => import('@/pages/My/TX-SRZD')
/** 我的收款账号 */
const SKAccount = () => import('@/pages/My/SK-Account')
/** 查看身份证图片 */
const checkID = () => import('@/pages/My/checkIDpic')
/** 用户手机号 */
const userMobile = () => import('@/pages/My/userMobile')
/** 输入验证码 */
const messageCode = () => import('@/pages/My/messageCode')
/** 更改密码 */
const changePassWord = () => import('@/pages/My/changePassWord')
/** 询问用户是否记得当前使用的密码 */
const rememberpass = () => import('@/pages/My/rememberpass')
/** 收货地址管理 */
const addressList = () => import('@/pages/My/addressList')
/** 常用发货快递 */
const commonKD = () => import('@/pages/My/commonKD')
/** 关注商家公众号 */
const careShopQr = () => import('@/pages/My/careShopQr')

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/bind',
    name: 'Bind',
    component: Bind,
    children: [
      {
        path: 'forget',
        name: 'Forget',
        component: Forget
      }
    ]
  },
  {
    path: '/authorization',
    name: 'authorization',
    component: authorization
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'other-orders',
        name: 'otherOrders',
        component: otherOrders,
        children: [
          {
            path: 'xjorder-detail',
            name: 'xjOrderDetail',
            component: xjOrderDetail
          },
          {
            path: 'wait-send',
            name: 'waitSend',
            component: waitSend
          }
        ]
      },
      {
        path: 'pay-pz',
        name: 'payPZ',
        component: payPZ
      },
      {
        path: 'go-purchase',
        name: 'Gopurchase',
        component: Gopurchase,
        children: [
          {
            path: 'go-truck',
            name: 'GoTruck',
            component: GoTruck
          },
          {
            path: 'goods-detail',
            name: 'GoodsDetail',
            component: GoodsDetail
          },
          {
            path: 'go-settlement',
            name: 'GoSettlement',
            component: GoSettlement,
            children: [
              {
                path: 'sub-voucher',
                name: 'Subvoucher',
                component: Subvoucher
              }
            ]
          }
        ]
      },
      {
        path: 'my-orders',
        name: 'myOrders',
        component: myOrders,
        children: [
          {
            path: 'order-detail',
            name: 'orderDetail',
            component: orderDetail
          },
          {
            path: 'apply-cancel',
            name: 'applyCancelOrder',
            component: applyCancelOrder
          }
        ]
      },
      {
        path: 'pay-succes',
        name: 'paySuccess',
        component: paySuccess
      },
      {
        path: 'jh-relation',
        name: 'JHRelation',
        component: JHRelation,
        children: [
          {
            path: 'leader-msg',
            name: 'LeaderMsg',
            component: LeaderMsg
          },
          {
            path: 'agent-detail',
            name: 'agentDetail',
            component: agentDetail,
            children: [
              {
                path: 'agentkc-list',
                name: 'agentKCList',
                component: agentKCList
              }
            ]
          },
          {
            path: 'team-msg',
            name: 'teamMsg',
            component: teamMsg
          }
        ]
      },
      {
        path: 'yq-relation',
        name: 'YQRelation',
        component: YQRelation,
        children: [
          {
            path: 'yqleader-msg',
            name: 'YQLeaderMsg',
            component: YQLeaderMsg
          },
          {
            path: 'yqagent-detail',
            name: 'YQagentDetail',
            component: YQagentDetail
          },
          {
            path: 'yqteam-msg',
            name: 'YQteamMsg',
            component: YQteamMsg
          }
        ]
      },
      {
        path: 'my-achieve',
        name: 'myAchieve',
        component: myAchieve,
        children: [
          {
            path: 'achieve-detail',
            name: 'myAchieveDetail',
            component: myAchieveDetail,
            children: [
              {
                path: 'achieve-history',
                name: 'myAchieveHistory',
                component: myAchieveHistory,
                children: [
                  {
                    path: 'history-list',
                    name: 'myAchieveHistoryList',
                    component: myAchieveHistoryList
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: 'sq-zs',
        name: 'SQZS',
        component: SQZS
      },
      {
        path: 'up-process',
        name: 'UpgradeLevel',
        component: UpgradeLevel,
        children: [
          {
            path: 'record-list',
            name: 'recordList',
            component: recordList,
            children: [
              {
                path: 'record-detail',
                name: 'RecordDetail',
                component: RecordDetail
              }
            ]
          }
        ]
      },
      {
        path: '/applyJoin/first-step',
        name: 'firstStep',
        component: firstStep
      },
      {
        path: '/applyJoin/second-step',
        name: 'secondStep',
        component: secondStep
      },
      {
        path: '/applyJoin/third-step',
        name: 'thirdStep',
        component: thirdStep,
        children: [
          {
            path: 'agent-detail',
            name: 'preAgentDetail',
            component: preAgentDetail
          }
        ]
      },
      {
        path: 'invitation-agent',
        name: 'InvitationAgent',
        component: InvitationAgent,
        children: [
          {
            path: 'create-link',
            name: 'CreateLink',
            component: CreateLink
          }
        ]
      },
      {
        path: 'examine-list',
        name: 'ExamineList',
        component: ExamineList
      },
      {
        path: 'y-ck',
        name: 'YCK',
        component: YCK,
        children: [
          {
            path: 'kc-jl',
            name: 'KCJL',
            component: KCJL
          },
          {
            path: 'th-dd',
            name: 'THDD',
            component: THDD,
            children: [
              {
                path: 'thdd-detail',
                name: 'THDDDetail',
                component: THDDDetail
              }
            ]
          },
          {
            path: 'kc-detail',
            name: 'KCDetail',
            component: KCDetail
          },
          {
            path: 'goods-list',
            name: 'GoodsList',
            component: GoodsList,
            children: [
              {
                path: 'yck-settlement',
                name: 'yckSettlement',
                component: yckSettlement
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/my',
    name: 'My',
    component: My,
    children: [
      {
        path: 'set-myinfo',
        name: 'setMyInfo',
        component: setMyInfo,
        children: [
          {
            path: 'info-detail',
            name: 'MyInfoDetail',
            component: MyInfoDetail,
            children: [
              {
                path: 'check-id',
                name: 'checkID',
                component: checkID
              },
              {
                path: 'user-mobile',
                name: 'userMobile',
                component: userMobile
              }
            ]
          },
          {
            path: 'remember-pass',
            name: 'rememberpass',
            component: rememberpass
          },
          {
            path: 'address-list',
            name: 'addressList',
            component: addressList
          },
          {
            path: 'common-kd',
            name: 'commonKD',
            component: commonKD
          },
          {
            path: 'care-shop',
            name: 'careShopQr',
            component: careShopQr
          }
        ]
      },
      {
        path: 'sk-account',
        name: 'SKAccount',
        component: SKAccount
      },
      {
        path: 'dk',
        name: 'DK',
        component: DK,
        children: []
      },
      {
        path: 'tx',
        name: 'TX',
        component: TX,
        children: [
          {
            path: 'tx-djs',
            name: 'TXDJS',
            component: TXDJS
          },
          {
            path: 'tx-srzd',
            name: 'TXSRZD',
            component: TXSRZD
          },
          {
            path: 'tx-sq',
            name: 'TXSQ',
            component: TXSQ
          },
          {
            path: 'tx-ing',
            name: 'TXING',
            component: TXING,
            children: [
              {
                path: 'tx-detail',
                name: 'TXDetail',
                component: TXDetail
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: 'message-code',
    name: 'messageCode',
    component: messageCode
  },
  {
    path: 'change-pass',
    name: 'changePassWord',
    component: changePassWord
  },
  {
    path: '/message',
    name: 'Message',
    component: Message
  }
]

export {
  routes
}
