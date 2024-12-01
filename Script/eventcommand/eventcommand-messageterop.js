
var MessageTeropEventCommand = defineObject(BaseEventCommand,
{
	_messageView: null,
	
	enterEventCommandCycle: function() {
		this._prepareEventCommandMemberData();
		
		if (!this._checkEventCommand()) {
			return EnterResult.NOTENTER;
		}
		
		return this._completeEventCommandMemberData();
	},
	
	moveEventCommandCycle: function() {
		if (this._messageView.moveMessageView() !== MoveResult.CONTINUE) {
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawEventCommandCycle: function() {
		if (this._messageView !== null) {
			this._messageView.drawMessageView();
		}
	},
	
	mainEventCommand: function() {
		if (this._messageView !== null) {
			this._messageView.endMessageView();
		}
	},
	
	_prepareEventCommandMemberData: function() {
		this._messageView = createObject(TeropView);
	},
	
	_checkEventCommand: function() {
		return this.isEventCommandContinue();
	},
	
	_completeEventCommandMemberData: function() {
		var messageViewParam = this._createMessageViewParam();
		
		this._messageView.setupMessageView(messageViewParam);
		
		return EnterResult.OK;
	},
	
	_createMessageViewParam: function() {
		var eventCommandData = root.getEventCommandObject();
		var messageViewParam = StructureBuilder.buildMessageViewParam();
		
		messageViewParam.messageLayout = this._getMessageLayout();
		messageViewParam.text = eventCommandData.getText();
		messageViewParam.pos = eventCommandData.getTextPosValue();
		messageViewParam.speakerType = eventCommandData.getSpeakerType();
		messageViewParam.unit = eventCommandData.getUnit();
		messageViewParam.npc = eventCommandData.getNpc();
		messageViewParam.facialExpressionId = eventCommandData.getFacialExpressionId();
		messageViewParam.isWindowDisplayable = eventCommandData.isTeropWindowDisplayable();
		
		return messageViewParam;
	},
	
	_getMessageLayout: function() {
		return root.getDefaultMessageLayout(MessageLayout.TEROP);
	}
}
);
