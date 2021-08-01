interface IPut<T> {
    (arg: T): void;
    pack: () => void;
}
declare const _default: <T, U>(receiver: (this: U, arg: T[]) => any, condition: {
    readonly duration?: number;
    readonly waitTime?: number;
    readonly capacity?: number;
}) => IPut<T>;
/**
 * Documentation https://kasslun.github.io/req-helper.doc/#packing
 * The packing() can be used to merge requests, through which you can package (push a single data into an array)
 * a batch of data for batch sending. Used to reduce the number of requests. It supports packaging within a fixed
 * time duration and alive time waitTime, as well as packaging by size capacity.
 *
 * It is mainly used to reduce the number of requests in frequent request scenarios such as system monitoring data reporting and user's behavior data reporting.
 *
 * @param receiver. receiver(packagedData): Function, packagedData(array) receiver. Triggered when the condition of
 * parameter 2 is arbitrarily satisfied and the package is not empty.
 *
 * @param condition. Object, Conditions that trigger packaging. There must be more than 1 of the 3 conditions.
 *
 * - condition.duration: Number, optional. The packaging is triggered again after a fixed time(ms) at the last trigger;
 * value of 0 triggers packaging at the next macro task. This condition takes effect when put() is called again after packaging.
 *
 * - condition.waitTime: Number, optional. Packaging is triggered if it is not put again within a period of time(ms) after
 * the last put; value of 0 triggers packaging at the next macro task. This condition takes effect again each time put() is called.
 *
 * - condition.capacity: Number, optional. Triggered when the number of put reaches or exceeds the capacity. This condition is determined each time put() is called.
 *
 * @return The packing(receiver, condition) Returns a put function to receive data.
 */
export default _default;
