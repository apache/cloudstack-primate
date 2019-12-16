import { api } from '@/api'
import { message, notification } from 'ant-design-vue'

export const queryAsyncJobResultPlugin = {

  install (Vue) {
    Vue.prototype.queryAsyncJobResult = function (options) {
      /**
       * @param {String} jobId
       * @param {String} successMessage
       * @param {Function} successMethod
       * @param {String} errorMessage
       * @param {Function} errorMethod
       * @param {String} loadingMessage
       * @param {String} catchMessage
       * @param {Function} catchMethod
       * @param {Number} loadingDuration
       */
      const { jobId, successMessage, successMethod, errorMessage, errorMethod, loadingMessage, catchMessage, catchMethod, loadingDuration = 3 } = options

      api('queryAsyncJobResult', { jobId }).then(json => {
        const result = json.queryasyncjobresultresponse

        if (result.jobstatus === 1) {
          message.success(successMessage || 'Success')
          successMethod && successMethod()
        } else if (result.jobstatus === 2) {
          notification.error({
            message: errorMessage || 'Error',
            description: result.jobresult.errortext || 'Error'
          })
          errorMethod && errorMethod()
        } else if (result.jobstatus === 0) {
          message
            .loading(loadingMessage, loadingDuration)
            .then(() => this.queryAsyncJobResult(options))
        }
      }).catch(e => {
        console.error(`${catchMessage} - ${e}`)
        notification.error({
          message: 'Error',
          description: catchMessage
        })
        catchMethod && catchMethod()
      })
    }
  }

}
