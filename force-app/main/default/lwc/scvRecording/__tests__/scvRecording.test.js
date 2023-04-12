import { createElement } from 'lwc';
import ScvRecording from 'c/scvRecording';

/** MODULES */
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

describe('c-scv-recording', () => {
	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	/**
	 * VoiceCall RecordingStatus__c not defined, so no buttons to be displayed
	 */
	it('No buttons - RecordingStatus__c = undefined', () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(0);
	});

	it('Component visibility when call is connected or ended', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);

		// Hidden by default
		expect(element.shadowRoot.querySelectorAll('lightning-card')).toHaveLength(
			0
		);

		// Display component when call is connected
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));
		await Promise.resolve();
		expect(element.shadowRoot.querySelectorAll('lightning-card')).toHaveLength(
			1
		);

		// Hiden when call is ended
		scvToolkitAPI.dispatchEvent(new CustomEvent('callended', {}));
		await Promise.resolve();
		expect(element.shadowRoot.querySelectorAll('lightning-card')).toHaveLength(
			0
		);
	});

	/**
	 * VoiceCall RecordingStatus__c = not_started
	 */
	it('Start button available for a new VoiceCall connected with RecordingStatus__c = not_started', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		// Connect call
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));

		const mockVoiceCall = {
			fields: {
				RecordingStatus__c: { value: 'not_started' }
			}
		};
		getRecord.emit(mockVoiceCall);

		await Promise.resolve();
		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0].iconName).toBe('utility:play');
	});

	it('Suspend and Stop buttons available for a new VoiceCall in progress', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		// Connect call
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));

		const mockVoiceCall = {
			fields: {
				RecordingStatus__c: { value: 'in_progress' }
			}
		};
		getRecord.emit(mockVoiceCall);

		await Promise.resolve();
		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(2);
		expect(buttons[0].iconName).toBe('utility:pause');
		expect(buttons[1].iconName).toBe('utility:stop');
	});

	it('Click on Start will display Suspend and Stop buttons', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		// Connect call
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));

		const mockVoiceCall = {
			fields: {
				RecordingStatus__c: { value: 'not_started' }
			}
		};
		getRecord.emit(mockVoiceCall);

		await Promise.resolve();
		const playButton = element.shadowRoot.querySelector('lightning-button');
		playButton.click();

		mockVoiceCall.fields.RecordingStatus__c = 'in_progress';
		getRecord.emit(mockVoiceCall);
		getFieldValue.mockReturnValue(mockVoiceCall.fields.RecordingStatus__c);
		await Promise.resolve();

		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(2);
		expect(buttons[0].iconName).toBe('utility:pause');
		expect(buttons[1].iconName).toBe('utility:stop');
	});

	it('Click on Suspend will display Resume and Stop buttons', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		// Connect call
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));

		const mockVoiceCall = {
			fields: {
				RecordingStatus__c: { value: 'in_progress' }
			}
		};
		getRecord.emit(mockVoiceCall);

		await Promise.resolve();
		const playButton = element.shadowRoot.querySelector('lightning-button');
		playButton.click();

		mockVoiceCall.fields.RecordingStatus__c = 'suspended';
		getRecord.emit(mockVoiceCall);
		getFieldValue.mockReturnValue(mockVoiceCall.fields.RecordingStatus__c);
		await Promise.resolve();

		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(2);
		expect(buttons[0].iconName).toBe('utility:play');
		expect(buttons[1].iconName).toBe('utility:stop');
	});

	it('Click on Stop will will not display any button', async () => {
		const element = createElement('c-scv-recording', { is: ScvRecording });
		document.body.appendChild(element);

		// Connect call
		const scvToolkitAPI = element.shadowRoot.querySelector(
			'lightning-service-cloud-voice-toolkit-api'
		);
		scvToolkitAPI.dispatchEvent(new CustomEvent('callconnected', {}));

		const mockVoiceCall = {
			fields: {
				RecordingStatus__c: { value: 'in_progress' }
			}
		};
		getRecord.emit(mockVoiceCall);

		await Promise.resolve();
		const playButton = element.shadowRoot.querySelectorAll('lightning-button');
		playButton[1].click(); // CLick on Stop button

		mockVoiceCall.fields.RecordingStatus__c = 'stopped';
		getRecord.emit(mockVoiceCall);
		getFieldValue.mockReturnValue(mockVoiceCall.fields.RecordingStatus__c);
		await Promise.resolve();

		const buttons = element.shadowRoot.querySelectorAll('lightning-button');
		expect(buttons).toHaveLength(0);
	});
});
