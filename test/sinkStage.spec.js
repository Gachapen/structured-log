import { expect } from 'chai';
import sinon from 'sinon';
import WrappedSink from '../src/wrappedSink';
import SinkStage from '../src/SinkStage';

describe('SinkStage', () => {
  it('should call emit on the sink', () => {
    const sink = new WrappedSink(() => null);
    const sinkEmitSpy = sinon.spy(sink, 'emit');
    const stage = new SinkStage(sink);

    return stage.emit([]).then(() => expect(sinkEmitSpy.calledOnce).to.be.true);
  });

  it('should call emit on the next stage', () => {
    const nextStage = new SinkStage();
    const nextStageEmitSpy = sinon.spy(nextStage, 'emit');

    const stage = new SinkStage();
    stage.setNextStage(nextStage);

    return stage.emit([]).then(() => expect(nextStageEmitSpy.calledOnce).to.be.true);
  });
});
