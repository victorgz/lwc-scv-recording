@isTest
private class ScvRecordingController_TEST {
	/**
	 * StartRecording - Successful response
	 */
	@isTest
	static void startRecordingSuccess() {
		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse('', 200));
			ScvRecordingController.startRecording('');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * StartRecording - Error response
	 */
	@isTest
	static void startRecordingKO() {
		String error = 'Script-thrown exception';

		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse(error, 400));
			ScvRecordingController.startRecording('');
		} catch (AuraHandledException e) {
			System.assertEquals(error, e.getMessage(), 'Invalid exception returned');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * SuspendRecording - Successful response
	 */
	@isTest
	static void suspendRecordingSuccess() {
		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse('', 200));
			ScvRecordingController.suspendRecording('');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * SuspendRecording - Error response
	 */
	@isTest
	static void suspendtRecordingKO() {
		String error = 'Script-thrown exception';

		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse(error, 400));
			ScvRecordingController.suspendRecording('');
		} catch (AuraHandledException e) {
			System.assertEquals(error, e.getMessage(), 'Invalid exception returned');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * ResumeRecording - Successful response
	 */
	@isTest
	static void resumeRecordingSuccess() {
		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse('', 200));
			ScvRecordingController.resumeRecording('');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * ResumeRecording - Error response
	 */
	@isTest
	static void resumeRecordingKO() {
		String error = 'Script-thrown exception';

		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse(error, 400));
			ScvRecordingController.resumeRecording('');
		} catch (AuraHandledException e) {
			System.assertEquals(error, e.getMessage(), 'Invalid exception returned');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * StopRecording - Successful response
	 */
	@isTest
	static void stopRecordingSuccess() {
		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse('', 200));
			ScvRecordingController.stopRecording('');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	/**
	 * StopRecording - Error response
	 */
	@isTest
	static void stopRecordingKO() {
		String error = 'Script-thrown exception';

		Test.startTest();
		try {
			Test.setMock(HttpCalloutMock.class, new MockHttpResponse(error, 400));
			ScvRecordingController.stopRecording('');
		} catch (AuraHandledException e) {
			System.assertEquals(error, e.getMessage(), 'Invalid exception returned');
		} catch (Exception e) {
			System.assert(false, 'Unexpected exception: ' + e.getMessage());
		} finally {
			Test.stopTest();
		}
	}

	public class MockHttpResponse implements HttpCalloutMock {
		String body;
		Integer statusCode;

		public MockHttpResponse(String body, Integer statusCode) {
			this.body = body;
			this.statusCode = statusCode;
		}

		public HTTPResponse respond(HTTPRequest req) {
			HttpResponse res = new HttpResponse();
			res.setHeader('Content-Type', 'application/json');
			res.setBody(this.body);
			res.setStatusCode(this.statusCode);
			return res;
		}
	}
}
