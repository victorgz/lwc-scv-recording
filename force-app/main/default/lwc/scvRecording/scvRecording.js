// Modules
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Schema
import ID_FIELD from '@salesforce/schema/VoiceCall.ID';
import VENDORCALLKEY_FIELD from '@salesforce/schema/VoiceCall.VendorCallKey';
import RECORDINGSTATUS_FIELD from '@salesforce/schema/VoiceCall.RecordingStatus__c';

// Apex
import startRecording from '@salesforce/apex/ScvRecordingController.startRecording';
import stopRecording from '@salesforce/apex/ScvRecordingController.stopRecording';
import suspendRecording from '@salesforce/apex/ScvRecordingController.suspendRecording';
import resumeRecording from '@salesforce/apex/ScvRecordingController.resumeRecording';

/** CONSTANTS */
// VoiceCall.RecordingStatus__c picklist values
const RECORDING_STATUS = Object.freeze({
	notStarted: 'not_started',
	inProgress: 'in_progress',
	suspended: 'suspended',
	stopped: 'stopped'
});

export default class ScvRecording extends LightningElement {
	@api recordId;

	isVisible = false;
	isLoading;

	@wire(getRecord, {
		recordId: '$recordId',
		fields: [VENDORCALLKEY_FIELD, RECORDINGSTATUS_FIELD]
	})
	voiceCall;

	handleCallConnected() {
		this.isVisible = true;
	}

	handleCallEnded() {
		this.isVisible = false;
		this.updateRecordingStatus(RECORDING_STATUS.stopped);
	}

	start() {
		this.isLoading = true;
		startRecording({ contactId: this.vendorCallKey })
			.then(() => {
				this.updateRecordingStatus(RECORDING_STATUS.inProgress);
			})
			.catch((error) => {
				this.isLoading = false;
				this.showErrorToast(this.reduceErrors(error));
			});
	}

	suspend() {
		this.isLoading = true;
		suspendRecording({ contactId: this.vendorCallKey })
			.then(() => {
				this.updateRecordingStatus(RECORDING_STATUS.suspended);
			})
			.catch((error) => {
				this.isLoading = false;
				this.showErrorToast(this.reduceErrors(error));
			});
	}

	resume() {
		this.isLoading = true;
		resumeRecording({ contactId: this.vendorCallKey })
			.then(() => {
				this.updateRecordingStatus(RECORDING_STATUS.inProgress);
			})
			.catch((error) => {
				this.isLoading = false;
				this.showErrorToast(this.reduceErrors(error));
			});
	}

	stop() {
		this.isLoading = true;
		stopRecording({ contactId: this.vendorCallKey })
			.then(() => {
				this.updateRecordingStatus(RECORDING_STATUS.stopped);
			})
			.catch((error) => {
				this.isLoading = false;
				this.showErrorToast(this.reduceErrors(error));
			});
	}

	updateRecordingStatus(status) {
		const fields = {};
		fields[ID_FIELD.fieldApiName] = this.recordId;
		fields[RECORDINGSTATUS_FIELD.fieldApiName] = status;

		const recordInput = { fields };
		updateRecord(recordInput)
			.catch((error) => {
				this.showErrorToast(error);
			})
			.finally(() => {
				this.isLoading = false;
			});
	}

	showErrorToast(errorMessage) {
		const evt = new ShowToastEvent({
			title: 'Error',
			message: errorMessage,
			variant: 'error'
		});
		this.dispatchEvent(evt);
	}

	reduceErrors(error) {
		let message = error?.body?.message;
		if (message) {
			message = JSON.parse(message)?.Message;
		}
		return message;
	}

	get vendorCallKey() {
		return getFieldValue(this.voiceCall.data, VENDORCALLKEY_FIELD);
	}

	get recordingStatus() {
		const result = getFieldValue(this.voiceCall.data, RECORDINGSTATUS_FIELD);
		return result;
	}

	get isStartButtonVisible() {
		return this.recordingStatus === RECORDING_STATUS.notStarted;
	}

	get isSuspendButtonVisible() {
		return this.recordingStatus === RECORDING_STATUS.inProgress;
	}

	get isResumeButtonVisible() {
		return this.recordingStatus === RECORDING_STATUS.suspended;
	}

	get isStopButtonVisible() {
		return (
			this.recordingStatus === RECORDING_STATUS.inProgress ||
			this.recordingStatus === RECORDING_STATUS.suspended
		);
	}

	get recordingIconVariant() {
		return this.recordingStatus === RECORDING_STATUS.inProgress ? 'error' : '';
	}
}
