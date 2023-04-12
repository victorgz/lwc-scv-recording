public with sharing class ScvRecordingController {
	private static final String INSTANCE_ID = 'TBD';
	private static final String BASE_URL = 'callout:AmazonConnect';

	@AuraEnabled
	public static void startRecording(String contactId) {
		StartContactRecordingBody body = new StartContactRecordingBody(
			contactId,
			contactId,
			INSTANCE_ID,
			'ALL'
		);

		HttpResponse response = doRecordingCallout(
			BASE_URL + '/contact/start-recording',
			JSON.serialize(body)
		);
		if (response.getStatusCode() != 200) {
			throw new AuraHandledException(response.getBody());
		}
	}

	@AuraEnabled
	public static void stopRecording(String contactId) {
		BaseRecordingBody body = new BaseRecordingBody(
			contactId,
			contactId,
			INSTANCE_ID
		);

		HttpResponse response = doRecordingCallout(
			BASE_URL + '/contact/stop-recording',
			JSON.serialize(body)
		);
		if (response.getStatusCode() != 200) {
			throw new AuraHandledException(response.getBody());
		}
	}

	@AuraEnabled
	public static void suspendRecording(String contactId) {
		BaseRecordingBody body = new BaseRecordingBody(
			contactId,
			contactId,
			INSTANCE_ID
		);

		HttpResponse response = doRecordingCallout(
			BASE_URL + '/contact/suspend-recording',
			JSON.serialize(body)
		);
		if (response.getStatusCode() != 200) {
			throw new AuraHandledException(response.getBody());
		}
	}

	@AuraEnabled
	public static void resumeRecording(String contactId) {
		BaseRecordingBody body = new BaseRecordingBody(
			contactId,
			contactId,
			INSTANCE_ID
		);

		HttpResponse response = doRecordingCallout(
			BASE_URL + '/contact/resume-recording',
			JSON.serialize(body)
		);
		if (response.getStatusCode() != 200) {
			throw new AuraHandledException(response.getBody());
		}
	}

	/**
	 * Perform the callout to the specific Amazon Connect recording endpoint
	 * @param endpoint The target endpoint to call
	 * @param body The body of the request
	 * @return An Apex HttpResponse
	 */
	private static HttpResponse doRecordingCallout(String endpoint, String body) {
		HttpRequest request = new HttpRequest();
		request.setMethod('POST');
		request.setBody(body);
		request.setEndpoint(endpoint);
		request.setHeader('Content-Type', 'application/json');
		return new Http().send(request);
	}

	/**
	 * Wrapper class for the body of the Amazon Recording-related endpoints
	 * @see https://docs.aws.amazon.com/connect/latest/APIReference/API_StartContactRecording.html
	 * @see https://docs.aws.amazon.com/connect/latest/APIReference/API_SuspendContactRecording.html
	 * @see https://docs.aws.amazon.com/connect/latest/APIReference/API_ResumeContactRecording.html
	 * @see https://docs.aws.amazon.com/connect/latest/APIReference/API_StopContactRecording.html
	 */
	public virtual class BaseRecordingBody {
		private String ContactId; // The identifier of the Amazon Connect contact
		private String InitialContactId; // The identifier of the contact associated with the first interaction with the contact center
		private String InstanceId; // The identifier of the Amazon Connect instance

		/**
		 * Constructors
		 */
		public BaseRecordingBody() {
		}
		public BaseRecordingBody(
			String contactId,
			String initialContactId,
			String instanceId
		) {
			this.ContactId = contactId;
			this.InitialContactId = initialContactId;
			this.InstanceId = instanceId;
		}
	}

	/**
	 * Extended wrapper class for the body of the Amazon Connect StartContactRecording endpoint
	 * @see https://docs.aws.amazon.com/connect/latest/APIReference/API_StartContactRecording.html
	 */
	public class StartContactRecordingBody extends BaseRecordingBody {
		private VoiceRecordingConfiguration VoiceRecordingConfiguration; // Specifies the person being recorded

		/**
		 * Constructors
		 */
		public StartContactRecordingBody(
			String contactId,
			String initialContactId,
			String instanceId,
			String voiceRecordingTrack
		) {
			this.ContactId = contactId;
			this.InitialContactId = initialContactId;
			this.InstanceId = instanceId;
			this.VoiceRecordingConfiguration = new VoiceRecordingConfiguration(
				voiceRecordingTrack
			);
		}
	}

	/**
	 * Wrapper class for the VoiceRecordingConfiguration object used by the StartContactRecordingBody class
	 */
	public class VoiceRecordingConfiguration {
		/**
		 * Identifies which track is being recorded.
		 * Valid Values: FROM_AGENT | TO_AGENT | ALL
		 */
		private String VoiceRecordingTrack;

		public VoiceRecordingConfiguration(String voiceRecordingTrack) {
			this.VoiceRecordingTrack = voiceRecordingTrack;
		}
	}
}
