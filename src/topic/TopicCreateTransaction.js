import proto from "@hashgraph/proto";
import Channel from "../Channel";
import Transaction, { DEFAULT_AUTO_RENEW_PERIOD } from "../Transaction";
import { Key } from "@hashgraph/cryptography";
import { _toProtoKey } from "../util";
import AccountId from "../account/AccountId";

/**
 * Create a topic to be used for consensus.
 */
export default class TopicCreateTransaction extends Transaction {
    /**
     * @param {object} props
     * @param {string} [props.topicMemo]
     * @param {Key} [props.adminKey]
     * @param {Key} [props.submitKey]
     * @param {number} [props.autoRenewPeriod]
     * @param {AccountId | string} [props.autoRenewAccountId]
     */
    constructor(props = {}) {
        super();

        /**
         * @private
         * @type {?string}
         */
        this._topicMemo = null;

        if (props.topicMemo != null) {
            this.setTopicMemo(props.topicMemo);
        }

        /**
         * @private
         * @type {?Key}
         */
        this._submitKey = null;

        if (props.submitKey != null) {
            this.setSubmitKey(props.submitKey);
        }

        /**
         * @private
         * @type {?Key}
         */
        this._adminKey = null;

        if (props.adminKey != null) {
            this.setAdminKey(props.adminKey);
        }

        /**
         * @private
         * @type {?AccountId}
         */
        this._autoRenewAccountId = null;

        if (props.autoRenewAccountId != null) {
            this.setAutoRenewAccountId(props.autoRenewAccountId);
        }

        /**
         * @private
         * @type {number}
         */
        this._autoRenewPeriod = DEFAULT_AUTO_RENEW_PERIOD;

        if (props.autoRenewPeriod != null) {
            this.setAutoRenewPeriod(props.autoRenewPeriod);
        }
    }

    /**
     * @returns {?string}
     */
    getTopicMemo() {
        return this._topicMemo;
    }

    /**
     * @param {string} topicMemo
     * @returns {this}
     */
    setTopicMemo(topicMemo) {
        this._requireNotFrozen();
        this._topicMemo = topicMemo;

        return this;
    }

    /**
     * @returns {?Key}
     */
    getAdminKey() {
        return this._adminKey;
    }

    /**
     * @param {Key} adminKey
     * @returns {this}
     */
    setAdminKey(adminKey) {
        this._requireNotFrozen();
        this._adminKey = adminKey;

        return this;
    }

    /**
     * @returns {?Key}
     */
    getSubmitKey() {
        return this._submitKey;
    }

    /**
     * @param {Key} submitKey
     * @returns {this}
     */
    setSubmitKey(submitKey) {
        this._requireNotFrozen();
        this._submitKey = submitKey;

        return this;
    }

    /**
     * Set to true to require the key for this account to sign any transfer of
     * hbars to this account.
     *
     * @param {boolean} receiverSignatureRequired
     * @returns {this}
     */
    setReceiverSignatureRequired(receiverSignatureRequired) {
        this._requireNotFrozen();
        this._receiverSignatureRequired = receiverSignatureRequired;

        return this;
    }

    /**
     * @returns {?AccountId}
     */
    getAutoRenewAccountId() {
        return this._autoRenewAccountId;
    }

    /**
     * @param {AccountId | string} autoRenewAccountId
     * @returns {this}
     */
    setAutoRenewAccountId(autoRenewAccountId) {
        this._requireNotFrozen();
        this._autoRenewAccountId = autoRenewAccountId instanceof AccountId
            ? autoRenewAccountId
            : AccountId.fromString(autoRenewAccountId);

        return this;
    }

    /**
     * @returns {number}
     */
    getAutoRenewPeriod() {
        return this._autoRenewPeriod;
    }

    /**
     * Set the auto renew period for this account.
     *
     * @param {number} autoRenewPeriod
     * @returns {this}
     */
    setAutoRenewPeriod(autoRenewPeriod) {
        this._requireNotFrozen();
        this._autoRenewPeriod = autoRenewPeriod;

        return this;
    }

    /**
     * @override
     * @protected
     * @param {Channel} channel
     * @returns {(transaction: proto.ITransaction) => Promise<proto.TransactionResponse>}
     */
    _getTransactionMethod(channel) {
        return (transaction) => channel.consensus.createTopic(transaction);
    }

    /**
     * @override
     * @protected
     * @returns {proto.TransactionBody["data"]}
     */
    _getTransactionDataCase() {
        return "consensusCreateTopic";
    }

    /**
     * @override
     * @protected
     * @returns {proto.IConsensusCreateTopicTransactionBody}
     */
    _makeTransactionData() {
        return {
            adminKey: this._adminKey != null ? _toProtoKey(this._adminKey) : null,
            submitKey: this._submitKey != null ? _toProtoKey(this._submitKey) : null,
            memo: this._topicMemo,
            autoRenewAccount: this._autoRenewAccountId?._toProtobuf(),
            autoRenewPeriod: {
                seconds: this._autoRenewPeriod,
            },
        };
    }
}
