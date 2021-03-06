/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

'use strict';

const { config: DefaultConfig } = require('./defaults');
const Chain = require('./chain');
const BaseModule = require('../base_module');

/* eslint-disable class-methods-use-this */

/**
 * Chain module specification
 *
 * @namespace Framework.Modules
 * @type {module.ChainModule}
 */
module.exports = class ChainModule extends BaseModule {
	constructor(options) {
		super(options);

		this.chain = null;
	}

	static get alias() {
		return 'chain';
	}

	static get info() {
		return {
			author: 'LiskHQ',
			version: '0.1.0',
			name: 'lisk-framework-chain',
		};
	}

	static get defaults() {
		return DefaultConfig;
	}

	get events() {
		return [
			'bootstrap',
			'blocks:change',
			'signature:change',
			'transactions:change',
			'rounds:change',
			'multisignatures:signature:change',
			'multisignatures:change',
			'delegates:fork',
			'loader:sync',
			'dapps:change',
		];
	}

	get actions() {
		return {
			calculateSupply: action => this.chain.actions.calculateSupply(action),
			calculateMilestone: action =>
				this.chain.actions.calculateMilestone(action),
			calculateReward: action => this.chain.actions.calculateReward(action),
			generateDelegateList: action =>
				this.chain.actions.generateDelegateList(action),
			updateForgingStatus: async action =>
				this.chain.actions.updateForgingStatus(action),
			postSignature: async action => this.chain.actions.postSignature(action),
			getForgingStatusForAllDelegates: async () =>
				this.chain.actions.getForgingStatusForAllDelegates(),
			getTransactionsFromPool: async action =>
				this.chain.actions.getTransactionsFromPool(action),
			getTransactions: async () => this.chain.actions.getTransactions(),
			getSignatures: async () => this.chain.actions.getSignatures(),
			getLastCommit: async () => this.chain.actions.getLastCommit(),
			getBuild: async () => this.chain.actions.getBuild(),
			postTransaction: async action =>
				this.chain.actions.postTransaction(action),
			getDelegateBlocksRewards: async action =>
				this.chain.actions.getDelegateBlocksRewards(action),
			getSlotNumber: async action => this.chain.actions.getSlotNumber(action),
			calcSlotRound: async action => this.chain.actions.calcSlotRound(action),
			getNodeStatus: async () => this.chain.actions.getNodeStatus(),
			blocks: async action => this.chain.actions.blocks(action),
			blocksCommon: async action => this.chain.actions.blocksCommon(action),
		};
	}

	async load(channel) {
		this.chain = new Chain(channel, this.options);
		await this.chain.bootstrap();
		channel.publish('chain:bootstrap');
	}

	async unload() {
		return this.chain.cleanup(0);
	}
};
